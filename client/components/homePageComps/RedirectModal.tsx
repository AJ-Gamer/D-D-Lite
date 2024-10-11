import React, { FC } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface RedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RedirectModal: FC<RedirectModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const handleGoToCharCreation = () => {
    onClose();
    navigate('/char-creation');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>No Characters Found</ModalHeader>
        <ModalBody>
          <Text>
            No characters were found, please make one.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleGoToCharCreation}>
            Go to Character Creation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RedirectModal;
