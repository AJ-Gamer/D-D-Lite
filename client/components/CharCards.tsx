import React, { FC } from 'react';
import {
  Box,
  Button,
  Heading,
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
    { characters.length > 0 ? (
      <Heading mt={20}>Choose Your Adventurer</Heading>
    ) : (
      <Heading mt={20}>No Adventurers Available</Heading>
    )}
    <Box display="flex" padding="1rem">
      {characters.map((char) => (
        <Box
          key={char.id}
          borderWidth="2px"
          borderRadius="lg"
          justifyItems="center"
          padding="1rem"
          margin="0 1rem"
          bg={selectedChar === char.id ? 'yellow.400' : 'gray.400'}
          boxShadow="2xl"
        >
          <Image
            src={char.image}
            alt={char.name}
            borderRadius="lg"
            border="1px solid black"
            boxSize="150px"
            objectFit="cover"
          />
          <Text mt={2} fontSize="xl" fontWeight="bold" color="black">
            {
              `${char.name.charAt(0).toUpperCase() + char.name.slice(1)}`
            }
          </Text>
          <Text mt={1} fontSize="lg" color="black" justifyItems="center">
            {
              `${char.race.charAt(0).toUpperCase() + char.race.slice(1)}
              ${char.class.charAt(0).toUpperCase() + char.class.slice(1)}`
            }
          </Text>
          {selectedChar !== char.id && (
            <>
              <Button
                bg="yellow.400"
                color="black"
                onClick={() => onSelectChar(char.id)}
                mt={2}
                width="100%"
              >
                Play as
                {' '}
                {char.name}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteChar(char.id)}
                color="gray.800"
                mt={2}
                top="1.2rem"
                left="8.4rem"
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
