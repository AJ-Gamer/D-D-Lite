import React, { FC } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Flex,
  Link,
  Button,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import MobileMenu from './navBarComps/MobileMenu';
import LogoutModal from './navBarComps/LogoutModal';

interface NavBarProps {
  setIsAuth: (isAuth: boolean) => void;
}

const NavBar: FC<NavBarProps> = ({ setIsAuth }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    onOpen();
  };

  const confirmLogout = () => {
    axios.post('/auth/logout')
      .then(() => {
        setIsAuth(false);
        navigate('/login');
      })
      .catch((err) => {
        console.error('Error logging out', err);
      });
    onClose();
  };

  const getActiveStyle = (path: string) => (
    location.pathname === path
      ? { color: '#FBBE30', fontWeight: 'bold' }
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
          <MobileMenu onLogout={handleLogout} />
        ) : (
          <Flex w="100%" alignItems="center">
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
            <Flex ml="auto">
              <Button onClick={handleLogout} variant="ghost" color="white" _hover={{ textDecoration: 'none', color: '#FBBE30' }}>
                Logout
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
      <LogoutModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmLogout}
      />
    </Box>
  );
};

export default NavBar;
