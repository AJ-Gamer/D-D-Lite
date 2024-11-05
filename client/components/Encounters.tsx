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
  HStack,
  Center,
  useToast,
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
  race: string;
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

const Encounters: FC<EncountersProps> = ({ profile }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentNode, setCurrentNode] = useState<StoryNode | null>(null);
  const [ending, setEnding] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [startCampaign, setStartCampaign] = useState<boolean>(false);

  const toast = useToast();

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
          params: { userId: profile?.id },
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
      speakText(data.prompt);
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

  const handleContinueCampaign = async () => {
    if (!selectedCharacter || !profile) return;

    setLoading(true);
    try {
      const { data }: { data: StoryNodeRes } = await axios.get('/encounters/loadProgress', {
        params: { userId: profile.id, characterId: selectedCharacter.id },
      });
      setCurrentNode(data);
      speakText(data.prompt);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast({
          title: 'No saved progress found.',
          description: 'You have not started this campaign yet.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } else {
        console.error('Error loading progress:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (nextNodeId: number | null, result?: string) => {
    if (result) {
      setEnding(result);
      speakText(result === 'good' ? 'You achieved the good ending!' : 'You met an unfortunate end.');
    } else if (nextNodeId !== null) {
      await fetchStoryNode(nextNodeId);
      if (profile && selectedCharacter) {
        await axios.post('/encounters/saveProgress', {
          userId: profile.id,
          characterId: selectedCharacter.id,
          storyNodeId: nextNodeId,
        });
      }
    }
  };

  const restartAdventure = () => {
    setEnding(null);
    fetchStoryNode(1);
  };

  if (loading) {
    return <Spinner size="xl" mt="20%" color="teal.500" />;
  }

  if (ending) {
    return (
      <Center>
        <Box textAlign="center" mt={16}>
          <Text fontSize="3xl" color="teal.600">
            {ending === 'good' ? 'You achieved the good ending!' : 'You met an unfortunate end.'}
          </Text>
          <Button mt={4} onClick={restartAdventure} bg="teal.400" _hover={{ bg: 'teal.300' }}>
            Restart the Adventure
          </Button>
        </Box>
      </Center>
    );
  }

  if (!selectedCharacter && !startCampaign) {
    return (
      <Center>
        <Box textAlign="center" mt={16}>
          <Text fontSize="2xl" mb={4} fontWeight={'bold'}>Select your character:</Text>
          <HStack spacing={6} mt={4} alignItems="center">
            {characters.map((char) => (
              <VStack
                key={char.id}
                borderWidth="2px"
                borderRadius="lg"
                bg={selectedCharacter === char.id ? 'yellow.400' : 'gray.400'}
                boxShadow="2x1"
                justifyItems="center"
                cursor="pointer"
                padding="1rem"
                margin="0 1rem"
                _hover={{bg: "yellow.400"}}
              >
                <Image
                  src={char.image}
                  alt={char.name}
                  borderRadius="lg"
                  boxSize="150px"
                  objectFit="cover"
                />
                <Text mt={2} fontSize="xl" fontWeight="bold" color="black">
                  {
                    `${char.name.charAt(0).toUpperCase() + char.name.slice(1)}`
                  }
                </Text>
                <Text mt={1} fontSize="lg" color="black" justifyItems="center">
                  {
                    `${char.race.charAt(0).toUpperCase() + char.race.slice(1)}
                    ${char.class.charAt(0).toUpperCase() + char.class.slice(1)}`
                  }
                </Text>
                <VStack spacing={1}>
                  <Text fontWeight="bold">Strength: {char.strength}</Text>
                  <Text fontWeight="bold">Dexterity: {char.dexterity}</Text>
                  <Text fontWeight="bold">Constitution: {char.constitution}</Text>
                  <Text fontWeight="bold">Charisma: {char.charisma}</Text>
                </VStack>
                <Button 
                  mt={2} 
                  color="black"
                  onClick={() => setSelectedCharacter(char)} 
                  bg="yellow.400" 
                  width="100%"
                >
                  Play as {char.name}
                </Button>
              </VStack>
            ))}
          </HStack>
        </Box>
      </Center>
    );
  }  

  if (selectedCharacter && !startCampaign) {
    return (
      <Center>
        <Box textAlign="center" mt={16}>
          <Text textStyle="lg" fontWeight={"bold"} mt={20} textColor={"red"}>LEGENDSPIRE</Text>
          <HStack spacing={6} mt={20}>
            <Button onClick={handleStartCampaign} bg="yellow.400" _hover={{ bg: 'orange.300' }} width="60%">
              Start
            </Button>
            <Button onClick={handleContinueCampaign} bg="yellow.400" _hover={{ bg: 'orange.300' }} width="60%">
              Continue
            </Button>
          </HStack>
        </Box>
      </Center>
    );
  }

  if (startCampaign && currentNode && selectedCharacter) {
    return (
      <Center>
        <Flex direction="row" justify="center" mt={16} mx={4} align="flex-start">
          <Box display="flex" flexDirection="column" alignItems="center" mt={4} mr={8}>
            <Image
              boxSize="200px"
              objectFit="cover"
              src={selectedCharacter.image}
              alt={`${selectedCharacter.name} Image`}
              borderRadius="md"
            />
            <Text fontSize="xl" fontWeight="bold" mt={2} color="black">{selectedCharacter.name}</Text>
            <StatsBox stats={selectedCharacter} />
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mt={4} flex={1}>
            <TTS
              prompt={replacePlaceholders(currentNode.prompt, selectedCharacter)}
            />
            <OptionsButtons options={currentNode.options} onOptionClick={handleOptionClick} />
          </Box>
        </Flex>
      </Center>
    );
  }

  return <Text color="red.500">Failed to load story node.</Text>;
};

export default Encounters;
