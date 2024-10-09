import React, { FC } from 'react';
import {
  Box,
  Flex,
  Link,
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const NavBar: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const location = useLocation();

  const getActiveStyle = (path: string) => (
    location.pathname === path
      ? { color: '#FBBE30', fontWeight: 'bold' } // Active link style
      : { color: 'white' }
  );

  return (
    <Box
      as="nav"
      bg="gray.800"
      color="white"
      px={4}
      py={3}
      position="fixed"
      width="100%"
      top={0}
      zIndex={1000}
      boxShadow="md"
    >
      <Flex justifyContent="space-between" alignItems="center">
        {isMobile ? (
          <Flex justifyContent="flex-end" w="100%">
            <Menu>
              <MenuButton as={Button} bg="#E6AD28" color="black" _hover={{ bg: '#E6AD28' }} _active={{ bg: '#E6AD28' }}>
                Menu
              </MenuButton>
              <MenuList bg="#FBBE30">
                <MenuItem as={RouterLink} to="/home" bg="#FBBE30" color="black" fontWeight="bold">Home</MenuItem>
                <Divider my={2} borderColor="gray.600" />
                <MenuItem as={RouterLink} to="/char-creation" bg="#FBBE30" color="black" fontWeight="bold">Character Creation</MenuItem>
                <Divider my={2} borderColor="gray.600" />
                <MenuItem as={RouterLink} to="/encounters" bg="#FBBE30" color="black" fontWeight="bold">Encounters</MenuItem>
                <Divider my={2} borderColor="gray.600" />
                <MenuItem as={RouterLink} to="/inventory" bg="#FBBE30" color="black" fontWeight="bold">Inventory</MenuItem>
                <Divider my={2} borderColor="gray.600" />
                <MenuItem as={RouterLink} to="/map-gen" bg="#FBBE30" color="black" fontWeight="bold">Map Generator</MenuItem>
                <Divider my={2} borderColor="gray.600" />
                <MenuItem as={RouterLink} to="/store" bg="#FBBE30" color="black" fontWeight="bold">Store</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <Flex alignItems="center" gap={4}>
            <Link as={RouterLink} to="/home" style={getActiveStyle('/home')} _hover={{ textDecoration: 'none', color: '#FBBE30' }}>
              Home
            </Link>
            <Link as={RouterLink} to="/char-creation" style={getActiveStyle('/char-creation')} _hover={{ textDecoration: 'none', color: '#FBBE30' }}>
              Character Creation
            </Link>
            <Link as={RouterLink} to="/encounters" style={getActiveStyle('/encounters')} _hover={{ textDecoration: 'none', color: '#FBBE30' }}>
              Encounters
            </Link>
            <Link as={RouterLink} to="/inventory" style={getActiveStyle('/inventory')} _hover={{ textDecoration: 'none', color: '#FBBE30' }}>
              Inventory
            </Link>
            <Link as={RouterLink} to="/store" style={getActiveStyle('/store')} _hover={{ textDecoration: 'none', color: '#FBBE30' }}>
              Store
            </Link>
            <Link as={RouterLink} to="/map-gen" style={getActiveStyle('/map-gen')} _hover={{ textDecoration: 'none', color: '#FBBE30' }}>
              Map Generator
            </Link>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default NavBar;
