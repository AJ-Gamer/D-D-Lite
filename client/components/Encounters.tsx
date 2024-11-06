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
  useColorMode,
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

interface StatCheck {
  stat: string;
  difficulty: number;
}

interface Option {
  id: number;
  text: string;
  nextNodeId: number | null;
  result?: string;
  statCheck?: StatCheck; // Add statCheck as optional
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
  const { colorMode } = useColorMode();

  const replacePlaceholders = (prompt: string, character: Character) => prompt
    .replace('{name}', character.name).replace('{class}', character.class);

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

  const handleOptionClick = async (option: Option) => {
    if (option.result) {
      setEnding(option.result);
      speakText(option.result === 'good' ? 'You achieved the good ending!' : 'You met an unfortunate end.');
    } else if (option.nextNodeId !== null) {
      // Implement statCheck validation here
      if (option.statCheck && selectedCharacter) {
        const charStat = selectedCharacter[option.statCheck.stat as keyof Character];
  
        if (typeof charStat === 'number' && charStat < option.statCheck.difficulty) {
          toast({
            title: 'Stat check failed!',
            description: `Your ${option.statCheck.stat} is too low.`,
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
          return; // Prevent moving to the next node
        }
      }
  
      await fetchStoryNode(option.nextNodeId);
      if (profile && selectedCharacter) {
        await axios.post('/encounters/saveProgress', {
          userId: profile.id,
          characterId: selectedCharacter.id,
          storyNodeId: option.nextNodeId,
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
      <Center minHeight="100vh">
        <Box textAlign="center" mt={16}>
          <Text fontSize="3xl" color="red.600">
            {ending === 'good' ? 'You achieved the good ending!' : 'You met an unfortunate end.'}
          </Text>
          <Button
            mt={4}
            onClick={restartAdventure}
            bg="yellow.400"
            _hover={{ bg: 'orange.400' }}
            color="black"
          >
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
          <Text fontSize="2xl" mb={4} fontWeight="bold">Select your character:</Text>
          <HStack spacing={6} mt={4} alignItems="center">
            {characters.map((char) => (
              <VStack
                key={char.id}
                borderWidth="2px"
                borderRadius="lg"
                bg={selectedCharacter === char.id ? 'yellow.400' : 'gray.400'}
                boxShadow="2x1"
                justifyItems="center"
                padding="1rem"
                margin="0 1rem"
                width="214px"
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
                  <Text color="black">Strength: {char.strength}</Text>
                  <Text color="black">Dexterity: {char.dexterity}</Text>
                  <Text color="black">Constitution: {char.constitution}</Text>
                  <Text color="black">Charisma: {char.charisma}</Text>
                </VStack>
                <Button
                  mt={2}
                  color="black"
                  onClick={() => setSelectedCharacter(char)}
                  bg="yellow.400"
                  width="100%"
                  _hover={{ bg: 'orange.400' }}
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
          <Text fontSize="6xl" fontWeight="bold" mt={20} textColor="red.600">LEGENDSPIRE</Text>
          <HStack spacing={6} mt={20}>
            <Button
              onClick={handleStartCampaign}
              bg="yellow.400"
              _hover={{ bg: 'orange.400' }}
              width="60%"
              color="black"
            >
              Start
            </Button>
            <Button
              onClick={handleContinueCampaign}
              bg="yellow.400"
              _hover={{ bg: 'orange.400' }}
              width="60%"
              color="black"
            >
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
        <Flex direction="row" justify="center" mt={16} mx={4} align="flex-start" maxWidth="1400px">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={4}
            mr={8}
          >
            <Image
              boxSize="200px"
              objectFit="cover"
              src={selectedCharacter.image}
              alt={`${selectedCharacter.name} Image`}
              borderRadius="md"
            />
            <Box
              w="200px"
              border="2px solid"
              borderColor={colorMode === 'light' ? 'black' : 'white'}
              borderRadius="md"
              mt={2}
              mb={2}
              textAlign="center"
              bg="none"
            >
              <Text fontSize="xl" fontWeight="bold" color={colorMode === 'light' ? 'black' : 'white'}>
                {selectedCharacter.name}
              </Text>
            </Box>
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
