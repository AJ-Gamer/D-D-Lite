import React, { FC, useEffect, useState } from 'react';
import { Box, SimpleGrid, Card, Text, Input, Button, Flex } from '@chakra-ui/react';
import axios from 'axios';

interface Equipment {
  name: string;
  index: string;
}

interface EquipmentDetail {
  name: string;
  desc: string[];
}

interface StoreProps {
  userId: number | undefined; // Define userId as a prop
}

const Store: FC<StoreProps> = ({ userId }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedEquipmentDetails, setSelectedEquipmentDetails] = useState<EquipmentDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [gold, setGold] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 20;

  const fetchGold = async () => {
    try {
      const response = await axios.get('/store/gold', {
        params: { userId },
      });
      setGold(response.data.gold);
    } catch (err) {
      setError('Failed to load gold amount');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get('/store/equipment');
        setEquipment(response.data);
        setFilteredEquipment(response.data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    fetchEquipment();
    fetchGold();
  }, []);

  useEffect(() => {
    const filtered = equipment.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEquipment(filtered);
    setCurrentPage(1);
  }, [searchTerm, equipment]);

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

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const paginatedItems = filteredEquipment.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Box pt="5%" px="5%">
      <Flex justify="space-between" align="center" mb={4}>
        <Input
          placeholder="Search for equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={5}
          bg="white"
          width="50%"
          boxShadow="md"
        />
        {gold !== null ? (
          <Text fontSize="lg" fontWeight="bold">Gold: {gold}</Text>
        ) : (
          <Text fontSize="lg">Loading gold...</Text>
        )}
      </Flex>

      <SimpleGrid columns={5} spacing={5}>
        {paginatedItems.map((item) => (
          <Card
            key={item.index}
            onClick={() => handleCardClick(item.index)}
            p={5}
            bg="#DA702F"
            cursor="pointer"
            height={selectedIndex === item.index ? 'auto' : '100px'}
            _hover={{ transform: selectedIndex === item.index ? 'none' : 'scale(1.05)', transition: '0.3s' }}
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

      <Box mt={5} textAlign="center">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          mr={2}
          bg="#FDCE5C"
        >
          Previous
        </Button>
        <Text display="inline" fontWeight="bold">
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          ml={2}
          bg="#FDCE5C"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Store;
