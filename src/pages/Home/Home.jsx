import styled from 'styled-components';
import { FileUpload } from '../../components/FileUpload/FileUpload';
import { ImageGrid } from '../../components/ImageGrid/ImageGrid';


const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

export const Home = () => {
  return (
    <Container>
      <Title>Thư viện ảnh</Title>
      <FileUpload />
      <ImageGrid />
    </Container>
  );
}; 