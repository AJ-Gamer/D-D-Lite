import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

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
        p={8}
        maxWidth="400px"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        bg="yellow.400"
      >
        <VStack spacing={6}>
          <Heading as="h1" size="xl" color="gray.700" textAlign="center">
            DnD Lite
          </Heading>
          <Text>Your adventure begins here</Text>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleGoogleLogin}
            width="full"
          >
            Login with Google
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
