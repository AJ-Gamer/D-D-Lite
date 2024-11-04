import React, { FC } from 'react';
import {
  Box,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

const MapLegend: FC = () => (
  <VStack align="center" spacing={1} mt={4}>
    <Text fontSize="lg" fontWeight="bold">Map Legend</Text>

    <HStack spacing={2} align="center">
      <Box
        width="20px"
        height="20px"
        bg="blue.300"
        borderRadius="4px"
        border="1px solid yellow"
      />
      <Text mr={2}>Water</Text>

      <Box
        width="20px"
        height="20px"
        bg="#ffe2ab"
        borderRadius="4px"
        border="1px solid yellow"
      />
      <Text mr={2}>Sand</Text>

      <Box
        width="20px"
        height="20px"
        bg="#6cc94f"
        borderRadius="4px"
        border="1px solid yellow"
      />
      <Text mr={2}>Grassland</Text>

      <Box
        width="20px"
        height="20px"
        bg="#005c32"
        borderRadius="4px"
        border="1px solid yellow"
      />
      <Text mr={2}>Forest</Text>

      <Box
        width="20px"
        height="20px"
        bg="#757575"
        borderRadius="4px"
        border="1px solid yellow"
      />
      <Text mr={2}>Mountain</Text>

      <Box
        width="20px"
        height="20px"
        bg="#c7c7c7"
        borderRadius="4px"
        border="1px solid yellow"
      />
      <Text mr={2}>Snow</Text>
    </HStack>
  </VStack>
);

export default MapLegend;
