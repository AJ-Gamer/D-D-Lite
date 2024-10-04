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

interface Character {
  id: number;
  name: string;
  class: string;
}

const Encounters: FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [ending, setEnding] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startCampaign, setStartCampaign] = useState<boolean>(false);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/character/all');
      setCharacters(data.characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchCharacters();
  }, []);

  const handleStartCampaign = () => {
    if (selectedCharacter) {
      setStartCampaign(true);
      fetchStoryNode(1);
    }
  };

  const handleOptionClick = async (nextNodeId: number | null, result?: string) => {
    if (result) {
      setEnding(result);
    } else if (nextNodeId !== null) {
      fetchStoryNode(nextNodeId);
    }
  };

  const restartAdventure = () => {
    setEnding(null);
    fetchStoryNode(1);
  };

  const replacePlaceholders = (prompt: string, character: Character) => {
    return prompt
      .replace('{name}', character.name)
      .replace('{class}', character.class);
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

  if (!selectedCharacter && !startCampaign) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="xl">Select a character to start your campaign:</Text>
        <VStack spacing={4} mt={4}>
          {characters.map((char) => (
            <Button key={char.id} onClick={() => setSelectedCharacter(char)}>
              {char.name} ({char.class})
            </Button>
          ))}
        </VStack>
      </Box>
    );
  }

  if (selectedCharacter && !startCampaign) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="2xl">Hello {selectedCharacter.name}, are you ready to start your campaign?</Text>
        <Button mt={4} onClick={handleStartCampaign}>
          Start your campaign
        </Button>
      </Box>
    );
  }

  if (startCampaign && currentNode && selectedCharacter) {
    return (
      <VStack spacing={5} mt="5%" align="center">
        <Text fontSize="2xl">
          {replacePlaceholders(currentNode.prompt, selectedCharacter)}
        </Text>
        {currentNode.options.map((option) => (
          <Button key={option.id} onClick={() => handleOptionClick(option.nextNodeId, option.result)}>
            {option.text}
          </Button>
        ))}
      </VStack>
    );
  }

  return <Text>Failed to load story node.</Text>;
};

export default Encounters;