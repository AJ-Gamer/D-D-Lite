import React, { FC } from 'react';
import { Select } from '@chakra-ui/react';

interface Character {
  id: number;
  name: string;
}

interface CharsProps {
  characters: Character[];
  onSelectChar: (id: number) => void;
  selectedChar: number | null;
}

const Characters: FC<CharsProps> = ({ characters, onSelectChar, selectedChar }) => (
  <Select
    bg="#B8860B"
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
);

export default Characters;
