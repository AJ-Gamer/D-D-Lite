import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Text,
  Button,
  VStack,
  Spinner,
  Image,
  Flex,
} from '@chakra-ui/react';
import StatsBox from './encountersComps/StatsBox';
import TTS from './encountersComps/TTS';
import OptionsButtons from './encountersComps/OptionsButtons';

interface Profile {
  id: number;
  googleId: string;
  email: string;
  name: string;
}

interface EncountersProps {
  profile: Profile | null;
}

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
  image?: string;
  strength: number;
  dexterity: number;
  constitution: number;
  charisma: number;
}

interface CharRes {
  characters: Character[];
}

interface StoryNodeRes {
  id: number;
  prompt: string;
  options: Option[];
}

const DEFAULT_IMAGE_URL = 'https://logos-world.net/wp-content/uploads/2021/12/DnD-Emblem.png';

const Encounters: FC<EncountersProps> = ({ profile }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [ending, setEnding] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startCampaign, setStartCampaign] = useState<boolean>(false);

  const replacePlaceholders = (prompt: string, character: Character) => 
    prompt.replace('{name}', character.name).replace('{class}', character.class);

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const { data }: { data: CharRes } = await axios.get('/character/all', {
          params: {
            userId: profile?.id,
          },
        });
        setCharacters(data.characters);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [profile?.id]);

  const fetchStoryNode = async (id: number) => {
    setLoading(true);
    try {
      const { data }: { data: StoryNodeRes } = await axios.get(`/encounters/story/${id}`);
      setCurrentNode(data);
      speakText(data.prompt); // Speak the prompt when fetched
    } catch (error) {
      console.error('Error fetching story node:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCampaign = () => {
    if (selectedCharacter) {
      setStartCampaign(true);
      fetchStoryNode(1);
    }
  };

  const handleOptionClick = (nextNodeId: number | null, result?: string) => {
    if (result) {
      setEnding(result);
      speakText(result === 'good' ? 'You achieved the good ending!' : 'You met an unfortunate end.');
    } else if (nextNodeId !== null) {
      fetchStoryNode(nextNodeId);
    }
  };

  const restartAdventure = () => {
    setEnding(null);
    fetchStoryNode(1);
  };

  if (loading) {
    return <Spinner size="xl" mt="20%" />;
  }

  if (ending) {
    return (
      <Box textAlign="center" mt={16}>
        <Text fontSize="3xl">
          {ending === 'good' ? 'You achieved the good ending!' : 'You met an unfortunate end.'}
        </Text>
        <Button mt={4} onClick={restartAdventure} bg="yellow.400" _hover={{ bg: 'orange.300' }}>
          Restart the Adventure
        </Button>
      </Box>
    );
  }

  if (!selectedCharacter && !startCampaign) {
    return (
      <Box textAlign="center" mt={16}>
        <VStack spacing={4} mt={4}>
          <Text fontSize="xl">Select a character to start your campaign:</Text>
          {characters.map((char) => (
            <Button
              key={char.id}
              onClick={() => setSelectedCharacter(char)}
              bg="yellow.400"
              _hover={{ bg: 'orange.300' }}
            >
              {char.name} ({char.class})
            </Button>
          ))}
        </VStack>
      </Box>
    );
  }

  if (selectedCharacter && !startCampaign) {
    return (
      <Box textAlign="center" mt={16}>
        <Text fontSize="2xl">Hello {selectedCharacter.name}, are you ready to start your campaign?</Text>
        <Button mt={4} onClick={handleStartCampaign} bg="yellow.400" _hover={{ bg: 'orange.300' }}>
          Start your campaign
        </Button>
      </Box>
    );
  }

  if (startCampaign && currentNode && selectedCharacter) {
    return (
      <Flex direction="row" justify="center" mt={16} mx={4} align="flex-start">
        <Box display="flex" flexDirection="column" alignItems="center" mt={4} mr={8}>
          <Image
            boxSize="200px"
            objectFit="cover"
            src={selectedCharacter.image ?? DEFAULT_IMAGE_URL}
            alt={`${selectedCharacter.name} Image`}
            fallbackSrc={DEFAULT_IMAGE_URL}
          />
          <StatsBox stats={selectedCharacter} />
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" mt={4} flex={1}>
          <TTS
            prompt={replacePlaceholders(currentNode.prompt, selectedCharacter)}
          />
          <OptionsButtons options={currentNode.options} onOptionClick={handleOptionClick} />
        </Box>
      </Flex>
    );
  }

  return <Text>Failed to load story node.</Text>;
};

export default Encounters;
