import React, { FC } from 'react';
import { Box, Text, Image } from '@chakra-ui/react';

const Store: FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Image src="https://i.makeagif.com/media/5-29-2016/OtT-9Z.gif" alt="Magical Merchant" boxSize="300px" />
      <Text fontSize="2xl" textAlign="center" mt={4}>
        One stop shop for all your magical and deadly adventurous needs!
      </Text>
    </Box>
  );
};

export default Store;
