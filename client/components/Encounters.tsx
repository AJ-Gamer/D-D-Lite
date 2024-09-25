import React, { FC } from 'react';
import { Box, Text, Image } from '@chakra-ui/react';

const Encounters: FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Image src="https://media.tenor.com/viw-vfM60tUAAAAM/spongebob-art-thou-feeling.gif" alt="campaign GIF" boxSize="300px" />
      <Text fontSize="2xl" textAlign="center" mt={4}>
        Campaign Adventures coming soon!
      </Text>
    </Box>
  );
};

export default Encounters;