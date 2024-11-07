import React, { FC } from 'react';
import { SimpleGrid, Button } from '@chakra-ui/react';

interface Op {
  id: number;
  nextNodeId: number | null;
  result?: string;
  text: string;
}

interface OptionsButtonsProps {
  options: Op[];
  onOptionClick: (option: Op) => void;
}

const OptionsButtons: FC<OptionsButtonsProps> = ({ options, onOptionClick }) => (
  <SimpleGrid columns={3} mt={32} spacing={4}>
    {options.map((option) => (
      <Button
        key={option.id}
        onClick={() => onOptionClick(option)}
        bg="yellow.400"
        color="black"
        _hover={{ bg: 'orange.400' }}
        size="lg"
        width="100%"
        whiteSpace="normal"
        wordBreak="break-word"
        aria-label={`Option ${option.id}`}
      >
        {option.text}
      </Button>
    ))}
  </SimpleGrid>
);

export default OptionsButtons;
