import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Button, VStack, Spinner } from '@chakra-ui/react';

interface Option {
  id: number;
  text: string;
  nextNodeId: number | null;
  result?: string;
}

interface StoryNode {
  id: number;
  prompt: string;
  options: Option[];
}

const Encounters: FC = () => {
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [ending, setEnding] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStoryNode = async (id: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/encounters/story/${id}`);
      setCurrentNode(data);
    } catch (error) {
      console.error('Error fetching story node:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoryNode(1);
  }, []);

  const handleOptionClick = async (nextNodeId: number | null, result?: string) => {
    if (result) {
      setEnding(result);
    } else if (nextNodeId !== null) {
      fetchStoryNode(nextNodeId);
    }
  };

  const restartAdventure = () => {
    setEnding(null);
    fetchStoryNode(0);
  };

  if (loading) {
    return <Spinner size="xl" mt="20%" />;
  }

  if (ending) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="3xl">
          {ending === 'good' ? 'You achieved the good ending!' : 'You met an unfortunate end.'}
        </Text>
        <Button mt={4} onClick={restartAdventure}>
          Restart the Adventure
        </Button>
      </Box>
    );
  }

  if (!currentNode) {
    return <Text>Failed to load story node.</Text>;
  }

  const { prompt, options } = currentNode;

  return (
    <VStack spacing={5} mt="4%" align="center">
      <Text fontSize="2xl">{prompt}</Text>
      {options.map((option) => (
        <Button key={option.id} onClick={() => handleOptionClick(option.nextNodeId, option.result)}>
          {option.text}
        </Button>
      ))}
    </VStack>
  );
};

export default Encounters;