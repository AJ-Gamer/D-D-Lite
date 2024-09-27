import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Image } from '@chakra-ui/react';

interface Character {
  name: string;
  class: string;
  race: string;
  startingEquipment: any[];
}

const Inventory = () => {
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fakeCharacter: Character = {
      name: 'Danny',
      class: 'Rogue',
      race: 'Dragonborn',
      startingEquipment: [],
    };

    const fetchStartingEquipment = async () => {
      try {
        const response = await axios.get('https://www.dnd5eapi.co/api/classes/rogue/starting-equipment');
        fakeCharacter.startingEquipment = response.data.starting_equipment;
        console.log(fakeCharacter);
        setCharacter(fakeCharacter);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchStartingEquipment();
  }, []);

  return (
    <Box p={4}>
      {character ? (
        <>
          <Text fontSize="2xl" fontWeight="bold">
            {character.name}'s Inventory
          </Text>
          <Text fontSize="lg">Class: {character.class}</Text>
          <Text fontSize="lg">Race: {character.race}</Text>
          <Box mt={4}>
            <Text fontSize="xl" fontWeight="bold">Starting Equipment:</Text>
            {character.startingEquipment.length > 0 ? (
              <ul>
                {character.startingEquipment.map((item, index) => (
                  <li key={index}>{item.equipment.name}</li>
                ))}
              </ul>
            ) : (
              <Text>No starting equipment found.</Text>
            )}
          </Box>
        </>
      ) : (
        <Text>Loading character data...</Text>
      )}
    </Box>
  );
};

export default Inventory;
