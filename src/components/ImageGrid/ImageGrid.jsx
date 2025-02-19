import React from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button/Button';
import { useFileContext } from '../../context/FileContext';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const ImageActions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
`;

export const ImageGrid = () => {
  const { files, loading, removeImage } = useFileContext();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <Grid>
      {files.map((file) => (
        <ImageCard key={file.key}>
          {file.type === 'video' ? (
            <Video controls>
              <source src={file.url} type="video/mp4" />
              Your browser does not support the video tag.
            </Video>
          ) : (
            <Image src={file.url} alt="uploaded" />
          )}
          <ImageActions>
            <Button onClick={() => removeImage(file.key)}>Xóa</Button>
          </ImageActions>
        </ImageCard>
      ))}
    </Grid>
  );
};
