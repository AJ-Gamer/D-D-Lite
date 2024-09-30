import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Select, Spinner, useToast, SimpleGrid, Card, CardHeader, CardBody } from '@chakra-ui/react';
import axios from 'axios';

interface Character {
  id: number;
  name: string;
  class: string;
  race: string;
}

const Inventory: FC<{ userId?: number }> = ({ userId }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedChar, setSelectedChar] = useState<number | null>(null);
  const [startingEquipment, setStartingEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get('/character/all', { params: { userId } });
        setCharacters(response.data.characters);
        setLoading(false);
      } catch (err) {
        setError('Failed to load characters');
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [userId]);

  const handleSelectChar = async (id: number) => {
    setSelectedChar(id);
    try {
      const character = characters.find(char => char.id === id);
      if (character) {
        const response = await axios.get(`/inventory/${character.class}`);
        setStartingEquipment(response.data.startingEquipment);
      }
    } catch (err) {
      setError('Failed to load starting equipment');
      toast({
        title: 'Error',
        description: 'Could not load starting equipment',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner alignContent="center" />;
  if (error) return <Text>{error}</Text>;

  return (
    <Box p={4} mt="5%">
      <Select placeholder="Select a character" onChange={(e) => handleSelectChar(parseInt(e.target.value, 10))}>
        {characters.map(character => (
          <option key={character.id} value={character.id}>
            {character.name}
          </option>
        ))}
      </Select>

      {selectedChar ? (
        <Box mt={4}>
          <Text fontSize="2xl">Starting Equipment:</Text>
          {startingEquipment.length > 0 ? (
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
              {startingEquipment.map((item, index) => (
                <Card key={index} variant="outline">
                  <CardHeader>
                    <Text fontSize="lg" fontWeight="bold">{item.equipment.name}</Text>
                  </CardHeader>
                  <CardBody>
                    <Text>{item.equipment.description || 'No description available.'}</Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Text>No starting equipment found.</Text>
          )}
        </Box>
      ) : (
        <Text>Select a character to view their inventory.</Text>
      )}
    </Box>
  );
};

export default Inventory;
