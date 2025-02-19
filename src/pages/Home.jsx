import React, { useState } from 'react';
import styled from 'styled-components';
import { FileUpload } from '../components/FileUpload/FileUpload';
import ImageGallery from './ImageGallery/ImageGallery';

const Container = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 40px; /* Khoảng cách giữa các section */
  border: 1px solid #ddd; /* Đường viền để phân cách rõ ràng */
  border-radius: 8px;
  padding: 16px;
`;

const UploadButton = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background: #0056b3;
  }
`;

const Home = () => {
  const [refresh, setRefresh] = useState(false);

  const handleUploadSuccess = () => {
    setRefresh(prev => !prev);
  };

  return (
    <Container>
      <Section>
        <UploadButton onClick={() => document.getElementById('file-upload').click()}>
          Tải lên
        </UploadButton>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </Section>
      <Section>
        <ImageGallery refresh={refresh} />
      </Section>
    </Container>
  );
};

export default Home; 