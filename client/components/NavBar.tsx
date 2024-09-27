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
        <MenuButton as={Button} bg="#B8860B" color="black" _hover={{ bg: "#DAA520" }}  _active={{ bg: "#B8860B" }}>
          Menu
        </MenuButton>
        <MenuList bg="#FDCE5C" color="black">
          <MenuItem as={Link} to="/home" bg="#FDCE5C" color="black">Home</MenuItem>
          <MenuItem as={Link} to="/char-creation" bg="#FDCE5C" color="black">Character Creation</MenuItem>
          <MenuItem as={Link} to="/encounters" bg="#FDCE5C" color="black">Encounters</MenuItem>
          <MenuItem as={Link} to="/inventory" bg="#FDCE5C" color="black">Inventory</MenuItem>
          <MenuItem as={Link} to="/map-gen" bg="#FDCE5C" color="black">Map Generator</MenuItem>
          <MenuItem as={Link} to="/store" bg="#FDCE5C" color="black">Store</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  </Box>
);

export default NavBar;
