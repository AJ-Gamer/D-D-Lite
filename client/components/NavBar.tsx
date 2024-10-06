import React, { FC } from 'react';
import { Box, Menu, MenuButton, MenuList, MenuItem, Button, Divider } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NavBar: FC = () => (
  <Box 
    as="nav" 
    bg="gray.800" 
    color="black" 
    px={4} 
    py={2} 
    position="fixed" 
    width="100%"
    height="8%"
    top={0} 
    zIndex={1000}
  >
    <Box position="absolute" right={4}>
      <Menu>
        <MenuButton as={Button} bg="#E6AD28" color="black" _hover={{ bg: "#E6AD28" }}  _active={{ bg: "#E6AD28" }}>
          Menu
        </MenuButton>
        <MenuList bg="#FBBE30">
          <MenuItem as={Link} to="/home" bg="#FBBE30" color="black" fontWeight="bold">Home</MenuItem>
          <Divider my={2} borderColor="gray.600" />
          <MenuItem as={Link} to="/char-creation" bg="#FBBE30" color="black" fontWeight="bold">Character Creation</MenuItem>
          <Divider my={2} borderColor="gray.600" />
          <MenuItem as={Link} to="/encounters" bg="#FBBE30" color="black" fontWeight="bold">Encounters</MenuItem>
          <Divider my={2} borderColor="gray.600" />
          <MenuItem as={Link} to="/inventory" bg="#FBBE30" color="black" fontWeight="bold">Inventory</MenuItem>
          <Divider my={2} borderColor="gray.600" />
          <MenuItem as={Link} to="/map-gen" bg="#FBBE30" color="black" fontWeight="bold">Map Generator</MenuItem>
          <Divider my={2} borderColor="gray.600" />
          <MenuItem as={Link} to="/store" bg="#FBBE30" color="black" fontWeight="bold">Store</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  </Box>
);

export default NavBar;
