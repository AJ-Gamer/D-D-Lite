import React, { FC } from 'react';
import { Box, Text, Image } from '@chakra-ui/react';

const Inventory: FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Image src="https://i.redd.it/c76d0zry2bw81.gif" alt="Inventory GIF" boxSize="300px" />
      <Text fontSize="2xl" textAlign="center" mt={4}>
        Adventuring gear is being shipped!
      </Text>
    </Box>
  );
};

export default Inventory;
