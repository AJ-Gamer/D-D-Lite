import React, { FC, useState } from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';

interface StoryNode {
  prompt: string;
  options: { text: string; nextNode: number | null; result?: string }[];
}

const storyline: StoryNode[] = [
  {
    prompt: 'You find yourself in a dark forest. Three paths lie ahead of you.',
    options: [
      { text: 'Take the left path', nextNode: 1 },
      { text: 'Take the middle path', nextNode: 2 },
      { text: 'Take the right path', nextNode: 3 },
    ],
  },
  {
    prompt: 'You encounter a strange merchant. He offers you a sword. Do you take it?',
    options: [
      { text: 'Yes', nextNode: 4 },
      { text: 'No', nextNode: 5 },
      { text: 'Ask for directions instead', nextNode: 6 },
    ],
  },
  {
    prompt: 'The middle path leads to a deep chasm. You fall and die.',
    options: [{ text: 'Restart', nextNode: 0, result: 'bad' }],
  },
  {
    prompt: 'The right path leads to a hidden cave. A treasure chest awaits.',
    options: [{ text: 'Open the chest', nextNode: 7 }],
  },
  {
    prompt: 'You take the sword. A sense of power surges through you.',
    options: [{ text: 'Continue', nextNode: 7 }],
  },
  {
    prompt: 'You refuse the sword and move on.',
    options: [{ text: 'Continue', nextNode: 7 }],
  },
  {
    prompt: 'The merchant gives you directions to the treasure.',
    options: [{ text: 'Follow the directions', nextNode: 7 }],
  },
  {
    prompt: 'You reach the treasure and claim victory. You’ve won the game!',
    options: [{ text: 'Play Again', nextNode: 0, result: 'good' }],
  },
];

const Encounters: FC = () => {
  const [currentNode, setCurrentNode] = useState<number>(0);
  const [ending, setEnding] = useState<string | null>(null);

  const handleOptionClick = (nextNode: number | null, result?: string) => {
    if (result) {
      setEnding(result);
    } else if (nextNode !== null) {
      setCurrentNode(nextNode);
    }
  };

  if (ending) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="3xl">{ending === 'good' ? 'You achieved the good ending!' : 'You met an unfortunate end.'}</Text>
        <Button mt={4} onClick={() => { setCurrentNode(0); setEnding(null); }}>
          Restart the Adventure
        </Button>
      </Box>
    );
  }

  const { prompt, options } = storyline[currentNode];

  return (
    <VStack spacing={5} mt="4%" align="center">
      <Text fontSize="2xl">{prompt}</Text>
      {options.map((option, index) => (
        <Button key={index} onClick={() => handleOptionClick(option.nextNode, option.result)}>
          {option.text}
        </Button>
      ))}
    </VStack>
  );
};

export default Encounters;