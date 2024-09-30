import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Image,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import CharCards from './CharCards';

interface Character {
  id: number;
  name: string;
  race: string;
  class: string;
  image: string;
  strength: number;
  dexterity: number;
  constitution: number;
  charisma: number;
}

const HomePage: FC = () => {
  const [chars, setChars] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);

  useEffect(() => {
    const fetchChars = async () => {
      try {
        const response = await axios.get<{ characters: Character[] }>('/character/all');
        setChars(response.data.characters);

        const savedCharId = localStorage.getItem('selectedChar');
        if (savedCharId) {
          setSelectedChar(parseInt(savedCharId, 10));
        }
      } catch (err) {
        console.error('Failed to fetch characters:', err);
      }
    };
    fetchChars();
  }, []);

  const handleSelectChar = (id: number) => {
    setSelectedChar(id);
    localStorage.setItem('selectedChar', id.toString());
  };

  const handleDeleteChar = async (id: number) => {
    try {
      await axios.delete(`/character/${id}`);
      setChars(chars.filter((char) => char.id !== id));
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const charObj = chars.find((char) => char.id === selectedChar);

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center">
        <CharCards
          characters={chars}
          onSelectChar={handleSelectChar}
          selectedChar={selectedChar}
          onDeleteChar={handleDeleteChar}
        />
      </Box>
      {charObj && (
        <Box
          mt={4}
          ml={4}
          display="flex"
          flexDirection="row"
        >
          {/* Character Stats */}
          <Box
            alignItems="left"
            textAlign="left"
            bg="#B8860B"
            borderWidth="1px"
            borderRadius="lg"
            width="20%"
            mr={4}
          >
            <Text fontSize="lg" fontWeight="bold" ml={4} mt={4}>
              Character Stats:
            </Text>
            <Divider my={2} borderColor="gray.600" />
            <Box ml={4} mt={4}>
              <Text fontSize="lg">Strength:</Text>
              <Text fontSize="lg" fontWeight="bold">{charObj.strength}</Text>
            </Box>
            <Divider my={2} borderColor="gray.600" />
            <Box ml={4} mt={4}>
              <Text fontSize="lg">Dexterity:</Text>
              <Text fontSize="lg" fontWeight="bold">{charObj.dexterity}</Text>
            </Box>
            <Divider my={2} borderColor="gray.600" />
            <Box ml={4} mt={4}>
              <Text fontSize="lg">Constitution:</Text>
              <Text fontSize="lg" fontWeight="bold">{charObj.constitution}</Text>
            </Box>
            <Divider my={2} borderColor="gray.600" />
            <Box ml={4} mt={4} mb={4}>
              <Text fontSize="lg">Charisma:</Text>
              <Text fontSize="lg" fontWeight="bold">{charObj.charisma}</Text>
            </Box>
          </Box>
          {/* Character Image */}
          <Box
            alignItems="center"
            textAlign="center"
            bg="#B8860B"
            borderWidth="1px"
            borderRadius="lg"
          >
            <Text fontSize="lg" fontWeight="bold"> Current Character:</Text>
            <Image
              src={charObj?.image}
              alt={charObj?.name}
              boxSize="300px"
              objectFit="cover"
              borderRadius="lg"
              m={8}
            />
            <Text fontSize="xl" fontWeight="bold" mt={2}>{charObj?.name}</Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default HomePage;
