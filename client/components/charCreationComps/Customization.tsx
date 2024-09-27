import React, { FC } from 'react';
import {
  Box,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';

interface CustomizationProps {
  charName: string;
  setCharName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  race: string;
  setRace: (race: string) => void;
  charClass: string;
  setCharClass: (charClass: string) => void;
}

const Customization: FC<CustomizationProps> = ({
  charName,
  setCharName,
  description,
  setDescription,
  race,
  setRace,
  charClass,
  setCharClass,
}) => {
  const races = ['Human', 'Elf', 'Dragonborn'];
  const classes = ['Barbarian', 'Rogue', 'Sorcerer'];

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Text fontSize="lg" mb={2} as="b">Name Your Adventurer</Text>
        <Input
          placeholder="Name..."
          value={charName}
          onChange={(e) => setCharName(e.target.value)}
          sx={{ '::placeholder': { color: 'gray.700' } }}
        />
      </Box>
      <Box>
        <Text fontSize="lg" mb={2} as="b">Adventurer Description</Text>
        <Textarea
          placeholder="Details (hair, eyes, etc)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ '::placeholder': { color: 'gray.700' } }}
          size="lg"
        />
      </Box>
      <Box>
        <Text fontSize="lg" mb={2} as="b">Select Race</Text>
        <Select
          placeholder="Select race"
          value={race}
          onChange={(e) => setRace(e.target.value)}
        >
          {races.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </Box>
      <Box>
        <Text fontSize="lg" mb={2} as="b">Select Class</Text>
        <Select
          placeholder="Select class"
          value={charClass}
          onChange={(e) => setCharClass(e.target.value)}
        >
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </Select>
      </Box>
    </VStack>
  );
};

export default Customization;
