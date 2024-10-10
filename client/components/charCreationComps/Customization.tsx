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
  const races = ['Human', 'Elf', 'Dragonborn'];
  const classes = ['Barbarian', 'Rogue', 'Sorcerer'];

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="2xl" textAlign="center" mt={4}>
        Create your character and embark on an epic adventure!
      </Text>
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
        <Text fontSize="lg" mb={2} as="b">
          Adventurer Description{' '}
          <Tooltip label="This will be used to generate your adventurer's image.">
            <Icon as={InfoOutlineIcon} w={4} h={4} ml={2} />
          </Tooltip>
        </Text>
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
        <RadioGroup onChange={setRace} value={race}>
          <Stack direction="row">
            {races.map((r) => (
              <Radio key={r} value={r}>
                {r}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
      <Box>
        <Text fontSize="lg" mb={2} as="b">Select Class</Text>
        <RadioGroup onChange={setCharClass} value={charClass}>
          <Stack direction="row">
            {classes.map((cls) => (
              <Radio key={cls} value={cls}>
                {cls}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
    </VStack>
  );
};

export default Customization;
