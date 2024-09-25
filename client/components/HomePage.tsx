import React, { FC } from 'react';
import { Box, Text, Image } from '@chakra-ui/react';

const HomePage: FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Image src="https://cdn.mos.cms.futurecdn.net/Z7Rv4K4aVfzDzJnHPJXPF8.gif" alt="Under Construction" boxSize="300px" />
      <Text fontSize="2xl" textAlign="center" mt={4}>
        This page is under construction!
      </Text>
    </Box>
  );
};

export default HomePage;
