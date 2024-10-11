import React, { FC, useEffect, useState } from 'react';
import { Box, SimpleGrid, Card, Text, Input, Button, Flex } from '@chakra-ui/react';
import axios from 'axios';

interface Equipment {
  id: number;
  name: string;
  index: string;
  owned: number;
}

interface EquipmentDetail {
  name: string;
  desc: string[];
}

interface StoreProps {
  userId: number | undefined;
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
      const response = await axios.get('/store/gold', { params: { userId } });
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

  const handleBuy = async (equipmentId: number, equipmentName: string) => {
    if (gold !== null && gold < 50) {
      alert('Not enough gold to buy this item.');
      return;
    }
  
    try {
      if (!userId) {
        alert('User ID is required.');
        return;
      }
  
      const response = await axios.post(`/store/buy`, { userId, equipmentId, equipmentName });
  
      const updatedEquipment = equipment.map(item =>
        item.id === equipmentId ? { ...item, owned: item.owned + 1 } : item
      );
  
      setEquipment(updatedEquipment);
      await fetchGold();
      alert(response.data.message);
    } catch (error) {
      console.error('Error buying equipment:', error);
    }
  };

  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const paginatedItems = filteredEquipment.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Box mt={10} px={4} maxWidth="100%" overflow="hidden">
      <Flex justify="space-between" align="center" mb={3}>
        <Input
          placeholder="Search for equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mt={8}
          bg="white"
          width="50%"
          boxShadow="md"
        />
        {gold !== null ? (
          <Text fontSize="lg" fontWeight="bold" mt={8}>Gold: {gold}</Text>
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
            bg="#F49004"
            cursor="pointer"
            height={selectedIndex === item.index ? 'auto' : '100px'}
            _hover={{ transform: selectedIndex === item.index ? 'none' : 'scale(1.05)', transition: '0.3s' }}
            position="relative"
          >
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold">{item.name}</Text>
              <Text fontWeight="bold" color="gray.600">Owned: {item.owned}</Text>
            </Flex>
            {selectedIndex === item.index && selectedEquipmentDetails && (
              <Box mt={2}>
                <Text mt={2} color="gray.600">
                  {selectedEquipmentDetails.desc.join(' ')}
                </Text>
              </Box>
            )}
            <Box mt={2}>
              <Text>Cost: 50 gold</Text>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuy(item.id, item.name);
                }}
                colorScheme="green"
                size="sm"
                mt={2}
              >
                Buy
              </Button>
            </Box>
          </Card>
        ))}
      </SimpleGrid>

      <Box mt={5} textAlign="center">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          mr={2}
          bg="#E6AD28"
          _hover={{ bg: "#E6AD28" }}
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
          bg="#E6AD28"
          _hover={{ bg: "#E6AD28" }}
        >
          Next
        </Button>
      </Box>

      <Flex justifyContent="center" mt={4}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            size="xs"
            mx={1}
            bg={page === currentPage ? "#F49004" : "#E6AD28"}
            _hover={{ bg: "#F49004" }}
            disabled={page === currentPage}
            border="none"
          >
            {page}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default Store;
