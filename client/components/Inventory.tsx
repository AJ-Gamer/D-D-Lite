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

        const equipmentPromises = characters.map(async (character) => {
          const res = await axios.get(`/inventory/${character.class}`, { params: { userId } });
          console.log('Response:', res.data.allEquipment);
          return res.data.allEquipment;
        });

        const equipmentArrays = await Promise.all(equipmentPromises);
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
    <Box p={4} mt={12}>
      <Text fontSize="2xl">Equipment:</Text>
      {equipment.length > 0 ? (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
          {equipment.map((item, index) => (
            <Card key={index} variant="outline" bg="#F49004">
              <CardHeader>
                <Text fontWeight="bold">{item.name}</Text>
              </CardHeader>
              <CardBody>
                <Text fontWeight="bold" mt={2}>Quantity: {item.owned}</Text>
                <Text>{item.description || 'No description available'}</Text>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Text>No equipment found.</Text>
      )}
    </Box>
  );
};

export default Inventory;
