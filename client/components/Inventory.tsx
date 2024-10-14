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
    const deleteSoldEquipment = async () => {
      try {
        await axios.delete('/inventory/deleteSold', { params: { userId } });
        console.log('Deleted equipment with zero quantity');
      } catch (error) {
        console.error('Error deleting zero-quantity equipment:', error);
      }
    };

    const insertStartingItems = async () => {
      try {
        const response = await axios.get('/character/all', { params: { userId } });
        const characters: Character[] = response.data.characters;
    
        console.log('Characters:', characters);
    
        const validClasses = ['sorcerer', 'rogue', 'barbarian'];

        const equipmentPromises = characters
          .filter((character) => {
            if (!validClasses.includes(character.class)) {
              console.warn(`Skipping invalid class: ${character.class}`);
              return false;
            }
            return true;
          })
          .map((character) =>
            axios.get(`/inventory/${character.class}`, { params: { userId } })
          );
    
        await Promise.all(equipmentPromises);
        console.log('Starting equipment loaded for all characters.');
      } catch (err) {
        console.error('Error loading starting equipment:', err);
        setError('Failed to load starting equipment');
      }
    };    

    const fetchAllEquipment = async () => {
      try {
        const response = await axios.get('/inventory/allEquipment', { params: { userId } });
        console.log('All Equipment:', response.data.allEquipment);
        setEquipment(response.data.allEquipment);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching all equipment:', err);
        setError('Failed to load all equipment');
        setLoading(false);
      }
    };

    const initializeInventory = async () => {
      setLoading(true);
      await deleteSoldEquipment();
      await insertStartingItems();
      await fetchAllEquipment();
    };

    initializeInventory();
  }, [userId]);

  if (loading) return <Spinner alignContent="center" />;
  if (error) return <Text>{error}</Text>;

  return (
    <Box p={4} mt={12}>
      <Text fontSize="2xl" fontWeight="bold">Equipment:</Text>
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
