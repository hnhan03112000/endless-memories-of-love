import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  },
});

export const uploadFile = async (file, category) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      
      const params = {
        Bucket: process.env.REACT_APP_AWS_BUCKET,
        Key: `${category}/${Date.now()}-${file.name}`,
        Body: new Uint8Array(arrayBuffer),
        ContentType: file.type,
      };

      try {
        await s3Client.send(new PutObjectCommand(params));
        resolve(params.Key);
      } catch (error) {
        console.error('Error uploading file:', error);
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const deleteFile = async (key) => {
  const params = {
    Bucket: process.env.REACT_APP_AWS_BUCKET,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const getFileUrl = async (key) => {
  const params = {
    Bucket: process.env.REACT_APP_AWS_BUCKET,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Generated URL:', url);
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const params = {
      Bucket: process.env.REACT_APP_AWS_BUCKET,
      MaxKeys: 1
    };
    
    const command = new ListObjectsCommand(params);
    await s3Client.send(command);
    console.log('Kết nối AWS S3 thành công!');
    return true;
  } catch (error) {
    console.error('Lỗi kết nối AWS S3:', error);
    throw error;
  }
};

export const listFiles = async (prefix = '') => {
  const params = {
    Bucket: process.env.REACT_APP_AWS_BUCKET,
    Prefix: prefix,
  };

  try {
    const command = new ListObjectsCommand(params);
    const data = await s3Client.send(command);
    
    // Lọc ra các file có định dạng ảnh hoặc video
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi'];
    return data.Contents
      .filter(item => validExtensions.some(ext => item.Key.endsWith(ext))) // Lọc theo định dạng
      .map(item => item.Key);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};
