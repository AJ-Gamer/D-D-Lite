import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Center,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import logo from '../assets/legendspireLogo.png';

interface AuthCheck {
  isAuthenticated: boolean
}

const Login: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<AuthCheck>('/auth/check-auth')
      .then((response) => {
        if (response.data.isAuthenticated) {
          navigate('/home');
        }
      })
      .catch((err: Error) => err);
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <Center minHeight="100vh">
      <Box
        // p={8}
        maxWidth="400px"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="xl"
        bg="yellow.400"
      >
        <VStack spacing={6}>
          <Image
            src={logo}
            alt="Legendspire Logo"
            borderWidth="1px"
            borderRadius="lg"
            // boxSize="300px"
            width="100%"
            objectFit="cover"
          />
          <Text color="gray.800">Your adventure begins here</Text>
          <Button
            color="black"
            variant="ghost"
            size="lg"
            fontWeight="bold"
            onClick={handleGoogleLogin}
            _hover={{
              bg: 'yellow.500',
            }}
            mb={2}
          >
            Login with Google
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
