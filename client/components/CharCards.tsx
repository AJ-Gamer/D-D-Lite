import React, { FC } from 'react';
import {
  Box,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

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
          width="214px"
          bg={selectedChar === char.id ? 'yellow.400' : 'gray.400'}
          boxShadow="2xl"
          onClick={() => onSelectChar(char.id)}
          cursor="pointer"
          position="relative"
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
            <DeleteIcon
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChar(char.id);
              }}
              color="gray.800"
              mt={2}
              _hover={{ color: 'yellow.600' }}
              position="absolute"
              top="1px"
              right="8px"
            />
          )}
        </Box>
      ))}
    </Box>
  </>
);

export default CharCards;
