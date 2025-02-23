import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button/Button';
import { IMAGE_CATEGORIES } from '../../constants/categories';
import { ACCEPTED_FILE_TYPES, FILE_TYPE_ICONS, MAX_FILE_SIZE } from '../../constants/fileTypes';
import { useFileContext } from '../../context/FileContext';

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 200px;
  font-size: 14px;
`;

const UploadContainer = styled.div`
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const PreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 600px;
  margin-top: 16px;
`;

const PreviewItem = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 4px;
  background: #f0f0f0;
  overflow: hidden;
`;

const PreviewImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const PreviewVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FileTypeIcon = styled.span`
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 16px;
`;

const FileInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 10px;
  text-align: center;
`;

const HiddenInput = styled.input`
  display: none;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

export const FileUpload = ({ onUploadSuccess }) => {
  const fileInput = useRef(null);
  const { addFiles, loading } = useFileContext();
  const [selectedCategory, setSelectedCategory] = useState(IMAGE_CATEGORIES.HEU_U.id);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setError(null);

    try {
      setSelectedFiles(prevFiles => [...prevFiles, ...files.map(file => ({
        file,
        preview: file.type.startsWith('image') 
          ? URL.createObjectURL(file) 
          : null,
        type: file.type.split('/')[0]
      }))]);
    } catch (err) {
      setError(err.message);
    }
    e.target.value = null;
  };

  const removeFile = (index) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      await addFiles(selectedFiles.map(f => f.file), selectedCategory);
      // Cleanup previews
      selectedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      setSelectedFiles([]);
      onUploadSuccess();
    }
  };

  return (
    <UploadContainer>
      <Select 
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {Object.values(IMAGE_CATEGORIES).map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </Select>
      <div>
        <Button onClick={() => fileInput.current.click()} disabled={loading}>
          Chọn file
        </Button>
        {selectedFiles.length > 0 && (
          <Button 
            onClick={handleUpload} 
            disabled={loading} 
            style={{ marginLeft: '8px' }}
          >
            {loading ? 'Đang tải lên...' : `Tải lên ${selectedFiles.length} file`}
          </Button>
        )}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <HiddenInput
        id="file-upload"
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        accept={`${ACCEPTED_FILE_TYPES.IMAGES},${ACCEPTED_FILE_TYPES.VIDEOS}`}
        multiple
      />
      {selectedFiles.length > 0 && (
        <PreviewContainer>
          {selectedFiles.map((file, index) => (
            <PreviewItem key={index}>
              <FileTypeIcon>{FILE_TYPE_ICONS[file.type]}</FileTypeIcon>
              {file.type === 'image' ? (
                <PreviewImage src={file.preview} />
              ) : (
                <PreviewVideo controls>
                  <source src={URL.createObjectURL(file.file)} type={file.file.type} />
                  Your browser does not support the video tag.
                </PreviewVideo>
              )}
              <FileInfo>{formatFileSize(file.file.size)}</FileInfo>
              <RemoveButton onClick={() => removeFile(index)}>×</RemoveButton>
            </PreviewItem>
          ))}
        </PreviewContainer>
      )}
    </UploadContainer>
  );
}; 