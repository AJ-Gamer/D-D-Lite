import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Divider,
  HStack,
  Image,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { GiStarFormation, GiLeatherBoot } from 'react-icons/gi';
import { FaFistRaised, FaHeart } from 'react-icons/fa';
import CharCards from './CharCards';
import RedirectModal from './homePageComps/RedirectModal';

interface Profile {
  id: number;
  googleId: string;
  email: string;
  name: string;
}

interface HomePageProps {
  profile: Profile | null;
}

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

const HomePage: FC<HomePageProps> = ({ profile }) => {
  const [chars, setChars] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchChars = async () => {
      try {
        const response = await axios.get<{ characters: Character[] }>('/character/all', {
          params: {
            userId: profile?.id,
          },
        });
        setChars(response.data.characters);

        if (response.data.characters.length === 0) {
          onOpen();
        }

        const savedCharId = localStorage.getItem('selectedChar');
        if (savedCharId) {
          setSelectedChar(parseInt(savedCharId, 10));
        }
      } catch (err) {
        console.error('Failed to fetch characters:', err);
      }
    };
    fetchChars();
  }, [onOpen, profile]);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (selectedChar) {
        setLoading(true);
        try {
          const charObj = chars.find((char) => char.id === selectedChar);
          if (charObj) {
            const response = await axios.get<{ startingEquipment: Equipment[] }>(`/inventory/${charObj.class}`, { params: { userId: profile?.id } });
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
  }, [selectedChar, chars, profile?.id]);

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
      <RedirectModal isOpen={isOpen} onClose={onClose} />
      {charObj && (
        <Box
          mt={8}
          p={4}
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          {/* Character Stats */}
          <Box
            alignItems="left"
            textAlign="left"
            borderWidth="2px"
            borderRadius="lg"
            boxShadow="xl"
            width="20%"
            mr={4}
          >
            <Box bg="gray.700" p={2} borderTopRadius="lg">
              <Text fontSize="lg" fontWeight="bold" color="white" align="center">
                Character Stats
              </Text>
            </Box>
            <Divider mb={2} borderColor="gray.600" />
            <HStack>
              <Box ml={4} mt={4}><FaFistRaised size={36} /></Box>
              <Box ml={4} mt={4}>
                <Text fontSize="lg">Strength:</Text>
                <Text fontSize="lg" fontWeight="bold">{charObj.strength}</Text>
              </Box>
            </HStack>
            <Divider my={2} borderColor="gray.600" />
            <HStack>
              <Box ml={4} mt={4}><GiLeatherBoot size={36} /></Box>
              <Box ml={4} mt={4}>
                <Text fontSize="lg">Dexterity:</Text>
                <Text fontSize="lg" fontWeight="bold">{charObj.dexterity}</Text>
              </Box>
            </HStack>
            <Divider my={2} borderColor="gray.600" />
            <HStack>
              <Box ml={4} mt={4}><FaHeart size={36} /></Box>
              <Box ml={4} mt={4}>
                <Text fontSize="lg">Constitution:</Text>
                <Text fontSize="lg" fontWeight="bold">{charObj.constitution}</Text>
              </Box>
            </HStack>
            <Divider my={2} borderColor="gray.600" />
            <HStack>
              <Box ml={4} my={4}><GiStarFormation size={36} /></Box>
              <Box ml={4} my={4}>
                <Text fontSize="lg">Charisma:</Text>
                <Text fontSize="lg" fontWeight="bold">{charObj.charisma}</Text>
              </Box>
            </HStack>
          </Box>
          {/* Character Image */}
          <Box
            alignItems="center"
            textAlign="center"
            borderWidth="2px"
            borderRadius="lg"
            width={['100%', '30%']}
            mr={[0, 4]}
            mb={[4, 0]}
            maxWidth="300px"
            overflow="hidden"
            boxShadow="xl"
          >
            <Box bg="gray.700" p={2} borderTopRadius="lg">
              <Text fontSize="lg" fontWeight="bold" color="white" align="center">
                Current Character
              </Text>
            </Box>
            <Divider mb={2} borderColor="gray.600" />
            <Text fontSize="xl" fontWeight="bold">
              {
                `${charObj.name.charAt(0).toUpperCase() + charObj.name.slice(1)}`
              }
            </Text>
            <Image
              src={charObj?.image}
              alt={charObj?.name}
              boxSize="80%"
              objectFit="contain"
              mx={8}
            />
          </Box>

          {/* Equipment Box */}
          <Box
            alignItems="left"
            textAlign="left"
            borderWidth="2px"
            borderRadius="lg"
            width="20%"
            boxShadow="xl"
          >
            <Box bg="gray.700" p={2} borderTopRadius="lg">
              <Text fontSize="lg" fontWeight="bold" color="white" align="center">
                Equipment
              </Text>
            </Box>
            <Divider mb={2} borderColor="gray.600" />
            {loading ? (
              <Text>Loading equipment...</Text>
            ) : (
              <Box my={4}>
                {equipment.length > 0 ? (
                  equipment.map((item, index) => (
                    <>
                      <Text key={index} fontSize="lg" fontWeight="bold" ml={4}>
                        {item.equipment.name}
                      </Text>
                      <Divider my={4} borderColor="gray.600" />
                    </>
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
