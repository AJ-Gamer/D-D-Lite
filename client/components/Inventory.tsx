import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Spinner, SimpleGrid, Card, CardHeader, CardBody } from '@chakra-ui/react';
import axios from 'axios';

interface Character {
  id: number;
  name: string;
  class: string;
  race: string;
}

const Inventory: FC<{ userId?: number }> = ({ userId }) => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharactersAndEquipment = async () => {
      try {
        const response = await axios.get('/character/all', { params: { userId } });
        const characters: Character[] = response.data.characters;

        // Fetch starting equipment for all characters
        const equipmentPromises = characters.map(async (character) => {
          const res = await axios.get(`/inventory/${character.class}`);
          return res.data.startingEquipment;
        });

        const equipmentArrays = await Promise.all(equipmentPromises);
        // Flatten the array of arrays into a single array
        const allEquipment = equipmentArrays.flat();
        setEquipment(allEquipment);
        setLoading(false);
      } catch (err) {
        setError('Failed to load characters or equipment');
        setLoading(false);
      }
    };

    fetchCharactersAndEquipment();
  }, [userId]);

  if (loading) return <Spinner alignContent="center" />;
  if (error) return <Text>{error}</Text>;

  return (
    <Box p={4} mt="3.5%">
      <Text fontSize="2xl">Starting Equipment:</Text>
      {equipment.length > 0 ? (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
          {equipment.map((item, index) => (
            <Card key={index} variant="outline" bg="#DA702F">
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
  );
};

export default Inventory;
