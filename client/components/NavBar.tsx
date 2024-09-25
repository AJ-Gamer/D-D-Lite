import React, { FC } from 'react';
import { Box, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
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
        <MenuButton as={Button} bg="gray.500">
          Menu
        </MenuButton>
        <MenuList>
          <MenuItem as={Link} to="/home">Home</MenuItem>
          <MenuItem as={Link} to="/char-creation">Character Creation</MenuItem>
          <MenuItem as={Link} to="/encounters">Encounters</MenuItem>
          <MenuItem as={Link} to="/inventory">Inventory</MenuItem>
          <MenuItem as={Link} to="/map-gen">Map Generator</MenuItem>
          <MenuItem as={Link} to="/store">Store</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  </Box>
);

export default NavBar;
