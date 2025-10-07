'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

// TODO: 색상을 글로벌 스타일 변수로 변경할 것
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  backgroundColor: '#FFF',
  borderRadius: '15px',
  boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
  padding: '15px',
  outline: 'none',
};

interface CustomModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function CustomModal({ isOpen, onClose, children }: CustomModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box sx={style}>
        {children}
      </Box>
    </Modal>
  );
}