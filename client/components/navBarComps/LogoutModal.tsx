import React, { FC } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from '@chakra-ui/react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Confirm Logout</ModalHeader>
      <ModalBody>
        Are you sure you want to log out?
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme="red" onClick={onConfirm}>
          Logout
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default LogoutModal;
