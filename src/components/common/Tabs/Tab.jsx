import React from 'react';
import styled from 'styled-components';

const StyledTab = styled.button`
  padding: 10px 20px;
  cursor: pointer;
  background: ${props => (props.isActive ? '#007bff' : '#f0f0f0')};
  color: ${props => (props.isActive ? 'white' : 'black')};
  border: none;
  border-radius: 4px;
  margin-right: 8px;

  &:hover {
    background: #0056b3;
    color: white;
  }
`;

const Tab = ({ isActive, onClick, children }) => {
  return (
    <StyledTab isActive={isActive} onClick={onClick}>
      {children}
    </StyledTab>
  );
};

export default Tab; 