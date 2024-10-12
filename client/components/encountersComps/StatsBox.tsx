import React, { FC } from 'react';
import {
  Box,
  Text,
  Divider,
} from '@chakra-ui/react';

interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  charisma: number;
}

const statsLabels: { label: string; key: keyof CharacterStats }[] = [
  { label: 'Strength', key: 'strength' },
  { label: 'Dexterity', key: 'dexterity' },
  { label: 'Constitution', key: 'constitution' },
  { label: 'Charisma', key: 'charisma' },
];

const StatsBox: FC<{ stats: CharacterStats }> = ({ stats }) => (
  <Box
    border="1px solid #ccc"
    p={4}
    bg="#F6CC12"
    borderRadius="md"
    w="200px"
    textAlign="center"
  >
    {statsLabels.map(({ label, key }, index) => (
      <React.Fragment key={key}>
        <Box mt={4}>
          <Text fontSize="lg">{label}:</Text>
          <Text fontSize="lg" fontWeight="bold">{stats[key]}</Text>
        </Box>
        {index < 3 && <Divider my={2} borderColor="gray.600" />}
      </React.Fragment>
    ))}
  </Box>
);

export default StatsBox;
