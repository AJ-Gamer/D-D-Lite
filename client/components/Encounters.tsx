import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Button, VStack, Spinner, Image, Flex, SimpleGrid, Divider } from '@chakra-ui/react';

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
  characterImage?: string;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  charisma?: number;
}

const DEFAULT_IMAGE_URL = 'https://logos-world.net/wp-content/uploads/2021/12/DnD-Emblem.png';

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
        <Button mt={4} onClick={restartAdventure} bg="#FDCE5C">
          Restart the Adventure
        </Button>
      </Box>
    );
  }

  if (!selectedCharacter && !startCampaign) {
    return (
      <Box textAlign="center" mt="3.5%">
        <Text fontSize="xl">Select a character to start your campaign:</Text>
        <VStack spacing={4} mt={4}>
          {characters.map((char) => (
            <Button key={char.id} onClick={() => setSelectedCharacter(char)} bg="#F49004" _hover={{ bg: "#FDCE5C" }}>
              {char.name} ({char.class})
            </Button>
          ))}
        </VStack>
      </Box>
    );
  }

  if (selectedCharacter && !startCampaign) {
    return (
      <Box textAlign="center" mt="3.7%">
        <Text fontSize="2xl">Hello {selectedCharacter.name}, are you ready to start your campaign?</Text>
        <Button mt={4} onClick={handleStartCampaign} bg="#F49004" _hover={{ bg: "#FDCE5C" }}>
          Start your campaign
        </Button>
      </Box>
    );
  }

  if (startCampaign && currentNode && selectedCharacter) {
    return (
      <Flex direction="row" justify="center" mt="3.5%" align="flex-start">
        <VStack spacing={4} ml={4} mt={4} align="center" mr={5}>
          <Image
            boxSize="200px"
            objectFit="cover"
            src={selectedCharacter.characterImage || DEFAULT_IMAGE_URL}
            alt={`${selectedCharacter.name} Image`}
            fallbackSrc={DEFAULT_IMAGE_URL}
          />
          <Box border="1px solid #ccc" p={4} bg="#F6CC12" borderRadius="md" w="200px" textAlign="center">
            <Box mt={4}>
              <Text fontSize="lg">Strength:</Text>
              <Text fontSize="lg" fontWeight="bold">{selectedCharacter.strength}</Text>
            </Box>.
            <Divider my={2} borderColor="gray.600" />
            <Box mt={4}>
              <Text fontSize="lg">Dexterity:</Text>
              <Text fontSize="lg" fontWeight="bold">{selectedCharacter.dexterity}</Text>
            </Box>
            <Divider my={2} borderColor="gray.600" />
            <Box mt={4}>
              <Text fontSize="lg">Constitution:</Text>
              <Text fontSize="lg" fontWeight="bold">{selectedCharacter.constitution}</Text>
            </Box>
            <Divider my={2} borderColor="gray.600" />
            <Box mt={4} mb={4}>
              <Text fontSize="lg">Charisma:</Text>
              <Text fontSize="lg" fontWeight="bold">{selectedCharacter.charisma}</Text>
            </Box>
          </Box>
        </VStack>

        <VStack spacing={5} flex={1} mt={10} align="center">
          <Text fontSize="2xl" textAlign="center" maxW="60%">
            {replacePlaceholders(currentNode.prompt, selectedCharacter)}
          </Text>

          <SimpleGrid columns={3} mt={40} spacing={4}>
            {currentNode.options.map((option) => (
              <Button key={option.id} onClick={() => handleOptionClick(option.nextNodeId, option.result)} bg="#F49004" _hover={{ bg: "#FDCE5C" }}>
                {option.text}
              </Button>
            ))}
          </SimpleGrid>
        </VStack>
      </Flex>
    );
  }

  return <Text>Failed to load story node.</Text>;
};

export default Encounters;