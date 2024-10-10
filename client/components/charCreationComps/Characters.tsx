import React, { FC } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';

interface Character {
  id: number;
  name: string;
}

interface CharsProps {
  characters: Character[];
  onSelectChar: (id: number) => void;
  selectedChar: number | null;
  onDeleteChar: (id: number) => void;
}

const Characters: FC<CharsProps> = ({
  characters,
  onSelectChar,
  selectedChar,
  onDeleteChar,
}) => {
  const charSlots = 4;
  const emptySlots = charSlots - characters.length;

  return (
    <Flex justifyContent="space-between" mb={4} mt={12} p={4} borderRadius="md" boxShadow="md">
      {characters.map((char) => (
        <Box
          key={char.id}
          border="1px solid"
          borderColor={selectedChar === char.id ? 'gold' : 'gray.500'}
          p={4}
          borderRadius="md"
          cursor="pointer"
          onClick={() => onSelectChar(char.id)}
          bg={selectedChar === char.id ? 'yellow.200' : 'gray.300'}
          transition="background-color 0.3s ease"
          width="150px"
          textAlign="center"
        >
          <Text fontWeight="bold">{char.name}</Text>
          <Button
            size="sm"
            colorScheme="red"
            mt={2}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteChar(char.id);
            }}
          >
            Delete
          </Button>
        </Box>
      ))}
      {Array.from({ length: emptySlots }).map((_, index) => (
        <Box
          // eslint-disable-next-line react/no-array-index-key
          key={`empty-slot-${index}`}
          border="1px dotted"
          borderColor="gray.300"
          p={4}
          borderRadius="md"
          width="150px"
          textAlign="center"
          bg="gray.600"
          color="gray.400"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Text>Add Character</Text>
        </Box>
      ))}
    </Flex>
  );
};

export default Characters;
