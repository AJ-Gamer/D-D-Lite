import React, { FC } from 'react';
import { Box, Text, Image } from '@chakra-ui/react';

const MapGen: FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Image src="https://www.hempuli.com/blog/content/genning.gif" alt="Map Generation GIF" boxSize="300px" />
      <Text fontSize="2xl" textAlign="center" mt={4}>
        Generate and download maps for IRL campaigns... eventually!
      </Text>
    </Box>
  );
};

export default MapGen;
