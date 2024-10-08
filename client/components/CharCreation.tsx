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
import CharGen from './charCreationComps/CharGen';

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

interface CreateCharRes {
  newChar: {
    id: number;
  }
}

interface ReplRes {
  imgUrl: string;
}

const CharCreation: FC<CharCreationProps> = ({ profile }) => {
  const [chars, setChars] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [charName, setCharName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [race, setRace] = useState<string>('');
  const [charClass, setCharClass] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
    setLoading(true);
    try {
      const response = await axios.post<CreateCharRes>('/character/create', {
        name: charName,
        description,
        class: charClass.toLowerCase(),
        race: race.toLowerCase(),
        userId: profile?.id,
      });
      console.log('Character creation response:', response.data);

      const characterId = response.data.newChar.id;
      const replResponse = await axios.post<ReplRes>('/replicate/gen-image', {
        prompt: description,
        characterId,
      });
      console.log(replResponse.data);
      const { imgUrl } = replResponse.data;

      await axios.put(`/character/${characterId}/update`, { image: imgUrl });
      setImageUrl(imgUrl);

      toast({
        title: 'Adventurer Created!',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Failed to Create Adventurer.',
        description: error ?? 'An Error occurred',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDeleteChar = async (id: number) => {
    try {
      await axios.delete(`/character/${id}`);
      setChars((prevChars) => prevChars.filter((char) => char.id !== id));
      toast({
        title: 'Character Deleted',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Failed to delete character',
        description: 'An error occurred while deleting the character.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner alignContent="center" />;
  if (error) return <Text>{error}</Text>;

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="80vh"
      padding="2rem"
    >
      <Characters
        characters={chars}
        onSelectChar={handleSelectChar}
        selectedChar={selectedChar}
        onDeleteChar={handleDeleteChar}
      />
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
      <Box flex={1} ml="2rem">
        <CharGen imageUrl={imageUrl} />
      </Box>
    </Box>
  );
};

export default CharCreation;
