import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Text, Image, Spinner } from '@chakra-ui/react';

interface Equipment {
  name: string;
  index: string;
}

const Store: FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get('/store/equipment');
        setEquipment(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Store Inventory</Text>
      {equipment.map((item) => (
        <Text key={item.index} my={2}>{item.name}</Text>
      ))}
    </Box>
  );
};

export default Store;
