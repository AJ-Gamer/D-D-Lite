import React, { FC } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  onLogout: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ onLogout }) => (
  <Menu>
    <MenuButton as={Button} bg="#E6AD28" color="black" _hover={{ bg: '#E6AD28' }} _active={{ bg: '#E6AD28' }}>
      Menu
    </MenuButton>
    <MenuList bg="#FBBE30">
      <MenuItem as={Link} to="/home" bg="#FBBE30" color="black" fontWeight="bold">
        Home
      </MenuItem>
      <Divider my={2} borderColor="gray.600" />
      <MenuItem as={Link} to="/char-creation" bg="#FBBE30" color="black" fontWeight="bold">
        Character Creation
      </MenuItem>
      <Divider my={2} borderColor="gray.600" />
      <MenuItem as={Link} to="/encounters" bg="#FBBE30" color="black" fontWeight="bold">
        Encounters
      </MenuItem>
      <Divider my={2} borderColor="gray.600" />
      <MenuItem as={Link} to="/inventory" bg="#FBBE30" color="black" fontWeight="bold">
        Inventory
      </MenuItem>
      <Divider my={2} borderColor="gray.600" />
      <MenuItem as={Link} to="/map-gen" bg="#FBBE30" color="black" fontWeight="bold">
        Map Generator
      </MenuItem>
      <Divider my={2} borderColor="gray.600" />
      <MenuItem as={Link} to="/store" bg="#FBBE30" color="black" fontWeight="bold">
        Store
      </MenuItem>
      <Divider my={2} borderColor="gray.600" />
      <MenuItem onClick={onLogout} bg="#FBBE30" color="black" fontWeight="bold">
        Logout
      </MenuItem>
    </MenuList>
  </Menu>
);

export default MobileMenu;
