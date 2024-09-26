import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import Characters from './charCreationComps/Characters';
import Customization from './charCreationComps/Customization';

interface Character {
  id: number;
  name: string;
}

interface Profile {
  id: number;
  googleId: string;
  email: string;
  name: string;
}

interface CharCreationProps {
  profile: Profile | null;
}

const CharCreation: FC<CharCreationProps> = ({ profile }) => {
  const [chars, setChars] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [charName, setCharName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [race, setRace] = useState<string>('');
  const [charClass, setCharClass] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchChars = async () => {
      try {
        const response = await axios.get<{ characters: Character[] }>('/character/all');
        setChars(response.data.characters);
        setLoading(false);

        const savedCharId = localStorage.getItem('selectedChar');
        if (savedCharId) {
          setSelectedChar(parseInt(savedCharId, 10));
        }
      } catch (err) {
        setError('Failed to load Characters');
        setLoading(false);
      }
    };
    fetchChars();
  }, []);

  const handleSelectChar = (id: number) => {
    setSelectedChar(id);
    localStorage.setItem('selectedChar', id.toString());
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/character/create', {
        name: charName,
        class: charClass.toLowerCase(),
        race: race.toLowerCase(),
        image: 'https://example.com/character-image',
        userId: profile?.id,
      });

      if (response) {
        toast({
          title: 'Adventurer Created!',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Failed to Create Adventurer.',
        description: error ?? 'An Error occurred',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Text>{error}</Text>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="80vh"
      mt="8%"
      padding="2rem"
    >
      <Characters characters={chars} onSelectChar={handleSelectChar} selectedChar={selectedChar} />
      <Text fontSize="2xl" textAlign="center" mt={4}>
        Create your character and embark on an epic adventure!
      </Text>
      <Box p={6} bg="#B8860B" alignContent="center" borderWidth="1px" borderRadius="lg">
        <Customization
          charName={charName}
          setCharName={setCharName}
          description={description}
          setDescription={setDescription}
          race={race}
          setRace={setRace}
          charClass={charClass}
          setCharClass={setCharClass}
        />
        <Button
          bg="#B8860B"
          mt={4}
          onClick={handleSubmit}
          isDisabled={!charName || !race || !charClass}
        >
          Create Character
        </Button>
      </Box>
    </Box>
  );
};

export default CharCreation;
