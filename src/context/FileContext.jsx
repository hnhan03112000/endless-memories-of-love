import React, { createContext, useState, useContext, useEffect } from 'react';
import { deleteFile, getFileUrl, testConnection, uploadFile } from '../services/aws';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addFiles = async (files, category) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const key = await uploadFile(file, category);
          const url = await getFileUrl(key);
          return { 
            key, 
            url, 
            category,
            type: file.type.split('/')[0],
            name: file.name,
            size: file.size
          };
        })
      );
      setFiles(prev => [...prev, ...results]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = async (key) => {
    setLoading(true);
    try {
      await deleteFile(key);
      setFiles(files.filter((file) => file.key !== key));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await testConnection();
        // Kết nối thành công
      } catch (error) {
        // Xử lý lỗi
      }
    };
    
    checkConnection();
  }, []);

  return (
    <FileContext.Provider value={{ 
      files, 
      loading, 
      error, 
      addFiles, 
      removeFile 
    }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => useContext(FileContext); 