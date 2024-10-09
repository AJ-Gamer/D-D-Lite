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
    try {
      const response = await axios.post<CreateCharRes>('/character/create', {
        name: charName,
        description,
        class: charClass.toLowerCase(),
        race: race.toLowerCase(),
        image: 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',
        userId: profile?.id,
      });
      const characterId = response.data.newChar.id;
      const replResponse = await axios.post<ReplRes>('/replicate/gen-image', {
        prompt: description,
        characterId,
      });
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
      padding="2rem"
    >
      <Characters
        characters={chars}
        onSelectChar={handleSelectChar}
        selectedChar={selectedChar}
        onDeleteChar={handleDeleteChar}
      />
      <Box p={6} bg="#F6CC12" alignContent="center" borderWidth="1px" borderRadius="lg">
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
          bg="#F6CC12"
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
