/* eslint-disable react/no-unescaped-entities */
import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import Characters from './charCreationComps/Characters';
import Customization from './charCreationComps/Customization';

interface Character {
  id: number;
  name: string;
  image: string;
  class: string;
  race: string;
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
    name: string;
    image: string;
    class: string;
    race: string;
  }
}

interface ReplRes {
  imgUrl: string;
}

const CharCreation: FC<CharCreationProps> = ({ profile }) => {
  const races = ['Human', 'Elf', 'Dragonborn'];
  const classes = ['Barbarian', 'Rogue', 'Sorcerer'];

  const getRandomOption = (options: string[]) => options[
    Math.floor(Math.random() * options.length)];

  const [chars, setChars] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [charName, setCharName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [race, setRace] = useState<string>(getRandomOption(races));
  const [charClass, setCharClass] = useState<string>(getRandomOption(classes));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchChars = async () => {
    try {
      const response = await axios.get<{ characters: Character[] }>('/character/all', {
        params: {
          userId: profile?.id,
        },
      });
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

  useEffect(() => {
    fetchChars();
  }, [fetchChars, profile]);

  const handleSelectChar = (id: number) => {
    setSelectedChar(id);
    localStorage.setItem('selectedChar', id.toString());
  };

  const handleSubmit = async () => {
    try {
      onOpen();
      const response = await axios.post<CreateCharRes>('/character/create', {
        name: charName,
        description,
        class: charClass.toLowerCase(),
        race: race.toLowerCase(),
        image: 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',
        userId: profile?.id,
      });
      const newCharacter = response.data.newChar;
      setChars((prevChars) => [...prevChars, newCharacter]);
      setSelectedChar(newCharacter.id);
      const replResponse = await axios.post<ReplRes>('/replicate/gen-image', {
        prompt: description,
        characterId: newCharacter.id,
      });
      const { imgUrl } = replResponse.data;

      await axios.put(`/character/${newCharacter.id}/update`, { image: imgUrl });

      toast({
        title: 'Adventurer Created!',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      setCharName('');
      setDescription('');
      setRace('');
      setCharClass('');
      fetchChars();
      setTimeout(onClose, 20000);
    } catch (err) {
      toast({
        title: 'Failed to Generate Image.',
        description: error ?? 'An Error occurred',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });

      setCharName('');
      setDescription('');
      setRace('');
      setCharClass('');
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
      maxWidth="1000px"
      mx="auto"
    >
      <Characters
        characters={chars}
        onSelectChar={handleSelectChar}
        selectedChar={selectedChar}
        onDeleteChar={handleDeleteChar}
      />
      <Text fontWeight="bold">{`Character Slots Used: ${chars.length}/4`}</Text>
      <Box
        p={6}
        alignContent="center"
        borderWidth="2px"
        borderRadius="lg"
        boxShadow="xl"
      >
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
          bg="yellow.400"
          color="black"
          mt={4}
          onClick={handleSubmit}
          isDisabled={!charName || !race || !charClass || !description}
        >
          Create Character
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generating Character Image</ModalHeader>
          <ModalBody>
            <Spinner size="xl" />
            <Text mt={4}>Please wait while we generate your character's image...</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CharCreation;
