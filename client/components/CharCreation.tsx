import React, { FC } from 'react';
import { Box, Text, Image } from '@chakra-ui/react';

const CharCreation: FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Image src="https://i.pinimg.com/736x/7e/cd/86/7ecd86d2a68ef73244750e8227670bec.jpg" alt="Character Creation Sheet" boxSize="300px" />
      <Text fontSize="2xl" textAlign="center" mt={4}>
        Create your character and embark on an epic adventure!
      </Text>
    </Box>
  );
};

export default CharCreation;
