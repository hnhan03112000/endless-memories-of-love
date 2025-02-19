import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getFileUrl, listFiles, deleteFile } from '../../services/aws';
import Tab from '../../components/common/Tabs/Tab';

const GalleryContainer = styled.div`
  padding: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Video = styled.video`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
`;

const DownloadButton = styled.a`
  position: absolute;
  bottom: 20px;
  right: 10px;
  background: rgba(0, 123, 255, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  text-decoration: none;
`;

const ImageGallery = ({ refresh }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageKeys = await listFiles();
        const imageUrls = await Promise.all(imageKeys.map(async (key) => {
          const url = await getFileUrl(key);
          return { key, url, type: key.split('.').pop() === 'mp4' ? 'video' : 'image' };
        }));

        setImages(imageUrls);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [refresh]);

  const handleDelete = async (key) => {
    try {
      await deleteFile(key);
      setImages(images.filter(image => image.key !== key));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Đang tải ảnh...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <GalleryContainer>
      <TabContainer>
        <Tab isActive={activeTab === 'all'} onClick={() => setActiveTab('all')}>Tất cả</Tab>
        <Tab isActive={activeTab === 'images'} onClick={() => setActiveTab('images')}>Ảnh</Tab>
        <Tab isActive={activeTab === 'videos'} onClick={() => setActiveTab('videos')}>Video</Tab>
      </TabContainer>
      <Grid>
        {images
          .filter(image => 
            (activeTab === 'all') || 
            (activeTab === 'images' && image.type === 'image') || 
            (activeTab === 'videos' && image.type === 'video')
          )
          .map(image => (
            <ImageCard key={image.key}>
              {image.type === 'video' ? (
                <Video controls>
                  <source src={image.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </Video>
              ) : (
                <Image src={image.url} alt={image.key} />
              )}
              <DeleteButton onClick={() => handleDelete(image.key)}>Xóa</DeleteButton>
              <DownloadButton href={image.url} download>
                Tải về
              </DownloadButton>
            </ImageCard>
          ))}
      </Grid>
    </GalleryContainer>
  );
};

export default ImageGallery;