import React, { FC } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
} from '@chakra-ui/react';

interface Character {
  id: number;
  name: string;
  image: string;
  race: string;
  class: string;
}

interface CharCardsProps {
  characters: Character[];
  onSelectChar: (id: number) => void;
  selectedChar: number | null;
  onDeleteChar: (id: number) => void;
}

const CharCards: FC<CharCardsProps> = ({
  characters,
  onSelectChar,
  selectedChar,
  onDeleteChar,
}) => (
  <>
    <Text fontSize="lg" color="yellow.300" mt={16}>Choose Your Adventurer</Text>
    <Box display="flex" padding="1rem">
      {characters.map((char) => (
        <Box
          key={char.id}
          borderWidth="1px"
          borderRadius="lg"
          padding="1rem"
          margin="0 1rem"
          bg={selectedChar === char.id ? 'yellow.300' : 'gray.500'}
        >
          <Image
            src={char.image}
            alt={char.name}
            borderRadius="lg"
            boxSize="150px"
            objectFit="cover"
          />
          <Text mt={2} fontSize="xl">{char.name}</Text>
          <Text mt={1} fontSize="lg">
            {char.race} {char.class}
          </Text>
          {selectedChar !== char.id && (
            <>
              <Button
                colorScheme="blue"
                onClick={() => onSelectChar(char.id)}
                mt={2}
                mr={4}
              >
                Play as
                {' '}
                {char.name}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => onDeleteChar(char.id)}
                mt={2}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      ))}
    </Box>
  </>
);

export default CharCards;
