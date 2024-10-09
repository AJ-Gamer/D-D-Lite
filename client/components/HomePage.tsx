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

interface Equipment {
  equipment: {
    name: string;
  };
}

const HomePage: FC = () => {
  const [chars, setChars] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchEquipment = async () => {
      if (selectedChar) {
        setLoading(true);
        try {
          const charObj = chars.find((char) => char.id === selectedChar);
          if (charObj) {
            const response = await axios.get(`/inventory/${charObj.class}`);
            setEquipment(response.data.startingEquipment);
          }
        } catch (error) {
          console.error('Failed to fetch equipment:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEquipment();
  }, [selectedChar, chars]);

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
          justifyContent="center"
        >
          {/* Character Stats */}
          <Box
            alignItems="left"
            textAlign="left"
            bg="#F6CC12"
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
            bg="#F6CC12"
            borderWidth="1px"
            borderRadius="lg"
            width={['100%', '30%']}
            mr={[0, 4]}
            mb={[4, 0]}
            maxWidth="300px"
            overflow="hidden"
          >
            <Text fontSize="lg" fontWeight="bold"> Current Character:</Text>
            <Image
              src={charObj?.image}
              alt={charObj?.name}
              boxSize="80%"
              objectFit="contain"
              borderRadius="lg"
              mx={8}
            />
            <Text fontSize="xl" fontWeight="bold" mt={2}>{charObj?.name}</Text>
          </Box>

          {/* Equipment Box */}
          <Box
            alignItems="center"
            textAlign="center"
            bg="#F6CC12"
            borderWidth="1px"
            borderRadius="lg"
            width="20%"
          >
            <Text fontSize="lg" fontWeight="bold" ml={4} mt={4}>
              Equipment:
            </Text>
            <Divider my={2} borderColor="gray.600" />
            {loading ? (
              <Text>Loading equipment...</Text>
            ) : (
              <Box ml={4} mt={4} mb={4}>
                {equipment.length > 0 ? (
                  equipment.map((item, index) => (
                    <Text key={index} fontSize="lg" fontWeight="bold">
                      {item.equipment.name}
                    </Text>
                  ))
                ) : (
                  <Text>No equipment available.</Text>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default HomePage;
