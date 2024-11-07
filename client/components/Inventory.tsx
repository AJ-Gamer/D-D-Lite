import React, { FC, useEffect, useState } from 'react';
import { Box, Text, Spinner, SimpleGrid, Card, Flex, Button, Select, Image, VStack, HStack } from '@chakra-ui/react';
import axios from 'axios';

interface Character {
  id: number;
  name: string;
  class: string;
  race: string;
  image?: string;
  strength: number;
  dexterity: number;
  constitution: number;
  charisma: number;
  equippedItems?: any[];
}

const Inventory: FC<{ userId?: number }> = ({ userId }) => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
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

    const fetchCharacters = async () => {
      try {
        const response = await axios.get('/character/all', { params: { userId } });
        setCharacters(response.data.characters);
      } catch (err) {
        console.error('Error fetching characters:', err);
        setError('Failed to load characters');
      }
    };

    const fetchAllEquipment = async () => {
      try {
        const response = await axios.get('/inventory/allEquipment', { params: { userId } });
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
      await fetchCharacters();
      await insertStartingItems();
      await fetchAllEquipment();
    };

    initializeInventory();
  }, [userId]);

  const handleEquip = async (item: any) => {
    if (!selectedCharacter) {
      setError('Select a character to equip items.');
      return;
    }
  
    const equipEndpoint = item.type === 'weapon' ? '/inventory/equipWeapon' : '/inventory/equipArmor';
    try {
      const response = await axios.patch(equipEndpoint, {
        itemName: item.name,
        characterId: selectedCharacter.id,
      });
  
      console.log(`Equipped ${item.name} for ${selectedCharacter.name}:`, response.data);
  
      // Fetch updated character details after equipping
      const updatedCharacterResponse = await axios.get(`/character/${selectedCharacter.id}`);
      setSelectedCharacter(updatedCharacterResponse.data);
  
      setSelectedItem(item);
    } catch (err) {
      console.error(`Error equipping item ${item.name}:`, err);
      setError(`Failed to equip ${item.name}`);
    }
  };  

  const handleCardClick = (item: any) => {
    setSelectedItem((prev: { name: any; }) => (prev?.name === item.name ? null : item));
  };

  if (loading) return <Spinner alignContent="center" />;
  if (error) return <Text>{error}</Text>;

  return (
    <Box p={4} mt={12}>
      <Flex direction="row" justify="flex-start" align="flex-start">
        {/* Character Selection Box (Left Side) */}
        <Box width="300px" mr={6}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Select a character:</Text>
          <Select
            placeholder="Select a character"
            onChange={(e) => {
              const charId = Number(e.target.value);
              const char = characters.find((c) => c.id === charId) || null;
              setSelectedCharacter(char);
            }}
            mb={4}
          >
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </Select>

          {selectedCharacter && (
            <VStack spacing={4} align="flex-start">
              <Image
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                boxSize="150px"
                objectFit="cover"
                borderRadius="lg"
              />
              <Text fontSize="xl" fontWeight="bold">{selectedCharacter.name}</Text>
              <Text>{`${selectedCharacter.race} ${selectedCharacter.class}`}</Text>

              {/* Display current equipped items */}
              <Box width="100%" borderTop="1px solid" borderColor="gray.300" pt={2}>
                <Text fontWeight="bold" mb={2}>Equipped Items:</Text>
                {selectedCharacter.equippedItems && selectedCharacter.equippedItems.length > 0 ? (
                  <VStack spacing={2} align="flex-start">
                    {selectedCharacter.equippedItems.map((item, index) => (
                      <Text key={index}>{item.name}</Text>
                    ))}
                  </VStack>
                ) : (
                  <Text>No items equipped.</Text>
                )}
              </Box>
            </VStack>
          )}
        </Box>

        {/* Equipment Section (Right Side) */}
        <Box flex="1">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>Equipment:</Text>
          
          {/* Weapons */}
          <Text fontSize="xl" fontWeight="bold" mb={2}>Weapons:</Text>
          <SimpleGrid columns={3} spacing={4}>
            {equipment.filter(item => item.type === 'weapon').map((item) => (
              <Card 
                key={item.id}
                // onClick={() => handleCardClick(item)}
                p={4} borderWidth="1px"
                borderRadius="md"
              >
                <Text fontSize="lg" fontWeight="bold">{item.name}</Text>
                <Button
                  variant="ghost"
                  size="sm"
                  width="fit-content"
                  mt={2}
                  onClick={() => handleEquip(item)}
                >
                  Equip
                </Button>
              </Card>
            ))}
          </SimpleGrid>

          {/* Armor */}
          <Text fontSize="xl" fontWeight="bold" mb={2}>Armor:</Text>
          <SimpleGrid columns={3} spacing={4}>
            {equipment.filter(item => item.type === 'armor').map((item) => (
              <Card key={item.id} onClick={() => handleCardClick(item)} p={4} borderWidth="1px" borderRadius="md">
                <Text fontSize="lg" fontWeight="bold">{item.name}</Text>
                <Button
                  variant="ghost"
                  size="sm"
                  width="fit-content"
                  mt={2}
                  onClick={() => handleEquip(item)}
                >
                  Equip
                </Button>
              </Card>
            ))}
          </SimpleGrid>

          {selectedItem && (
            <Box mt={6} p={4} bg="yellow.300" borderRadius="md" shadow="md">
              <Text fontSize="lg" fontWeight="bold">
                {selectedItem.name}
              </Text>
              <Text mt={2}>{selectedItem.description || 'No description available.'}</Text>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Inventory;
