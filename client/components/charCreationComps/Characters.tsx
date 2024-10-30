import React, { FC } from 'react';
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';

interface Character {
  id: number;
  name: string;
  image: string;
  class: string;
  race: string;
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
    <Flex
      justifyContent="space-between"
      mb={4}
      mt={12}
      p={4}
      borderRadius="md"
      boxShadow="md"
    >
      {characters.map((char) => (
        <Box
          key={char.id}
          border="1px solid"
          borderColor={selectedChar === char.id ? 'yellow.400' : 'gray.500'}
          p={4}
          borderRadius="md"
          cursor="pointer"
          onClick={() => onSelectChar(char.id)}
          bg={selectedChar === char.id ? 'yellow.400' : 'gray.300'}
          transition="background-color 0.3s ease"
          width="200px"
          textAlign="center"
        >
          <Image
            src={char.image}
            alt={`${char.name}'s image`}
            borderRadius="full"
            boxSize="130px"
            objectFit="cover"
            mx="auto"
            mb={2}
          />
          <Text fontWeight="bold" color="black">{char.name}</Text>
          <Text fontSize="sm" color="gray.700">{
              `${char.race.charAt(0).toUpperCase() + char.race.slice(1)}
              ${char.class.charAt(0).toUpperCase() + char.class.slice(1)}`
            }
          </Text>
          <Button
            size="sm"
            variant="ghost"
            width="100%"
            color="black"
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
          key={`empty-slot-${index}`}
          border="1px dotted"
          borderColor="gray.300"
          p={4}
          borderRadius="md"
          width="200px"
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
