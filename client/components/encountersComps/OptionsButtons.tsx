import React, { FC } from 'react';
import {
  SimpleGrid,
  Button,
} from '@chakra-ui/react';

interface Op {
  id: number;
  nextNodeId: number | null;
  result?: string;
  text: string;
}

interface OptionsButtonsProps {
  options: Op[];
  onOptionClick: (nextNodeId: number | null, result?: string) => void;
}

const OptionsButtons: FC<OptionsButtonsProps> = ({ options, onOptionClick }) => (
  <SimpleGrid columns={3} mt={64} spacing={4}>
    {options.map((option) => (
      <Button
        key={option.id}
        onClick={() => onOptionClick(option.nextNodeId, option.result)}
        bg="#F49004"
        _hover={{ bg: '#FDCE5C' }}
        whiteSpace="normal"
        wordBreak="break-word"
      >
        {option.text}
      </Button>
    ))}
  </SimpleGrid>
);

export default OptionsButtons;
