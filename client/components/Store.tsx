import React, { FC, useEffect, useState } from 'react';
import { Box, SimpleGrid, Card, Text } from '@chakra-ui/react';
import axios from 'axios';

interface Equipment {
  name: string;
  index: string;
}

interface EquipmentDetail {
  name: string;
  desc: string[];
}

const Store: FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedEquipmentDetails, setSelectedEquipmentDetails] = useState<EquipmentDetail | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get('/store/equipment');
        setEquipment(response.data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchEquipment();
  }, []);

  const handleCardClick = async (index: string) => {
    if (selectedIndex === index) {
      setSelectedIndex(null);
      setSelectedEquipmentDetails(null);
    } else {
      try {
        const response = await axios.get(`/store/equipment/${index}`);
        setSelectedIndex(index);
        setSelectedEquipmentDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch equipment details', error);
      }
    }
  };

  return (
    <Box pt="10%" px="5%">
      <SimpleGrid columns={5} spacing={5}>
        {equipment.map((item) => (
          <Card
            key={item.index}
            onClick={() => handleCardClick(item.index)}
            p={5}
            cursor="pointer"
            height={selectedIndex === item.index ? 'auto' : '100px'}
            _hover={{ transform: selectedIndex === item.index ? 'none' : 'scale(1.05)', transition: '0.3s' }}
            border={selectedIndex === item.index ? '2px solid #DAA520' : '1px solid #B8860B'}
          >
            <Text fontWeight="bold">{item.name}</Text>
            {selectedIndex === item.index && selectedEquipmentDetails && (
              <Box mt={2}>
                <Text mt={2} color="gray.600">
                  {selectedEquipmentDetails.desc.join(' ')}
                </Text>
              </Box>
            )}
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Store;
