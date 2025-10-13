import { useCallback, useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setSelectedItem('');
  }, []);

  const handleOpenWithItem = useCallback((item: string) => {
    setSelectedItem(item);
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    selectedItem,
    handleOpenWithItem,
    handleCloseModal,
  };
};