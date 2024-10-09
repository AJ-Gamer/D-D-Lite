import React, { FC } from 'react';
import { Box, Button, Select } from '@chakra-ui/react';

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
}) => (
  <Box mb={4}>
    <Select
      bg="#B8860B"
      mt={12}
      mb={4}
      placeholder="Select Character"
      value={selectedChar ?? ''}
      onChange={(e) => onSelectChar(Number(e.target.value))}
    >
      {characters.map((char) => (
        <option color="#B8860B" key={char.id} value={char.id}>
          {char.name}
        </option>
      ))}
    </Select>
    {characters.map((char) => (
      <Box key={char.id} display="flex" alignItems="center" mt={2}>
        <Button
          size="sm"
          colorScheme="red"
          onClick={() => onDeleteChar(char.id)}
        >
          Delete
          {' '}
          {char.name}
        </Button>
      </Box>
    ))}
  </Box>
);

export default Characters;
