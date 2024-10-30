import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Spinner, SimpleGrid, Card, Flex, Button } from '@chakra-ui/react';
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
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

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
          .filter((character) => validClasses.includes(character.class))
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

  const handleCardClick = (item: any) => {
    // Toggle selection: deselect if the same item is clicked again
    setSelectedItem((prev: { name: any; }) => (prev?.name === item.name ? null : item));
  };

  if (loading) return <Spinner alignContent="center" />;
  if (error) return <Text>{error}</Text>;

  return (
    <Box p={4} mt={12}>
      <Text fontSize="2xl" fontWeight="bold" align="center">
        Equipment:
      </Text>
      {equipment.length > 0 ? (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={5} mt={4}>
          {equipment.map((item, index) => (
            <Card
              key={index}
              onClick={() => handleCardClick(item)}
              p={5}
              bg="yellow.400"
              color="black"
              cursor="pointer"
              height="100px"
              _hover={{ transform: 'scale(1.05)', transition: '0.3s' }}
              position="relative"
              shadow={selectedItem?.name === item.name ? 'xl' : 'md'} // Highlight selected card
            >
              <Flex justify="space-between" align="center">
                <Text fontWeight="bold">{item.name}</Text>
                <Text fontWeight="bold">Owned: {item.owned}</Text>
              </Flex>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Equipped ${item.name}`);
                }}
                colorScheme="blue"
                size="sm"
                width="fit-content"
                mt={2}
              >
                Equip
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Text>No equipment found.</Text>
      )}

      {selectedItem && (
        <Box mt={6} p={4} bg="yellow.300" borderRadius="md" shadow="md">
          <Text fontSize="lg" fontWeight="bold">
            {selectedItem.name}
          </Text>
          <Text mt={2}>{selectedItem.description || 'No description available.'}</Text>
        </Box>
      )}
    </Box>
  );
};

export default Inventory;
