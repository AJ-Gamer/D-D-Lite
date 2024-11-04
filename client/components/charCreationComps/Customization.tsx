import React, { FC } from 'react';
import {
  Box,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

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
  const races = [
    { name: 'Human', tooltip: '+2 Charisma' },
    { name: 'Elf', tooltip: '+2 Dexterity' },
    { name: 'Dragonborn', tooltip: '+2 Constitution' },
  ];
  const classes = [
    { name: 'Barbarian', tooltip: '+3 Strength, +2 Constitution' },
    { name: 'Rogue', tooltip: '+2 Dexterity, +3 Charisma' },
    { name: 'Sorcerer', tooltip: '+3 Constitution, +2 Charisma' },
  ];

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="2xl" textAlign="center" mt={2}>
        Create your character and embark on an epic adventure!
      </Text>
      <Box>
        <Text fontSize="lg" mb={2} as="b">Name Your Adventurer</Text>
        <Input
          isInvalid={!charName}
          placeholder="Name..."
          value={charName}
          onChange={(e) => setCharName(e.target.value)}
          sx={{ '::placeholder': { color: 'gray.500' } }}
        />
      </Box>
      <Box>
        <Text fontSize="lg" mb={2} as="b">
          Adventurer Description{' '}
          <Tooltip label="This will be used to generate your adventurer's image.">
            <Icon as={InfoOutlineIcon} w={4} h={4} ml={2} />
          </Tooltip>
        </Text>
        <Textarea
          isInvalid={!description}
          placeholder="Details (hair, eyes, etc)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ '::placeholder': { color: 'gray.500' } }}
          size="lg"
        />
      </Box>
      <Box>
        <Text fontSize="lg" mb={2} as="b">Select Race</Text>
        <RadioGroup onChange={setRace} value={race}>
          <Stack direction="row">
            {races.map(({ name, tooltip }) => (
              <Tooltip key={name} label={tooltip}>
                <Box>
                  <Radio value={name}>{name}</Radio>
                </Box>
              </Tooltip>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
      <Box>
        <Text fontSize="lg" mb={2} as="b">Select Class</Text>
        <RadioGroup onChange={setCharClass} value={charClass}>
          <Stack direction="row">
            {classes.map(({ name, tooltip }) => (
              <Tooltip key={name} label={tooltip}>
                <Box>
                  <Radio value={name}>{name}</Radio>
                </Box>
              </Tooltip>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
    </VStack>
  );
};

export default Customization;
