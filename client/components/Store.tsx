import React, { FC, useEffect, useState } from 'react';
import { Box, SimpleGrid, Card, Text, Input, Button, Flex, Tabs, TabList, Tab, TabPanels, TabPanel, useToast, Tooltip, Progress } from '@chakra-ui/react';
import axios from 'axios';

interface Equipment {
  id: number;
  name: string;
  index: string;
  owned: number;
  url: string;
}

interface EquipmentDetail {
  name: string;
  desc: string[];
  cost: any;
}

interface StoreProps {
  userId: number | undefined;
}

const Store: FC<StoreProps> = ({ userId }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [magicItems, setMagicItems] = useState<Equipment[]>([]);
  const [filteredMagicItems, setFilteredMagicItems] = useState<Equipment[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedEquipmentDetails, setSelectedEquipmentDetails] = useState<EquipmentDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [gold, setGold] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('equipment');
  const [loading, setLoading] = useState<boolean>(false);
  const itemsPerPage = 20;

  const toast = useToast();

  const fetchGold = async () => {
    try {
      const response = await axios.get('/store/gold', { params: { userId } });
      setGold(response.data.gold);
    } catch (err) {
      setError('Failed to load gold amount');
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load your gold amount.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/store/equipment', { params: { userId } });
        setEquipment(response.data);
        setFilteredEquipment(response.data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMagicItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/store/magic-items', { params: { userId } });
        setMagicItems(response.data);
        setFilteredMagicItems(response.data);
      } catch (error) {
        console.error('Error fetching magic items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
    fetchMagicItems();
    fetchGold();
  }, [userId]);

  const handleBuy = async (equipmentName: string, equipmentIndex: string, equipmentUrl: string) => {
    if (gold !== null && gold < 50) {
      toast({
        title: 'Insufficient Gold',
        description: 'Not enough gold to buy this item.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (!userId) {
        toast({
          title: 'Error',
          description: 'User ID is required to make a purchase.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const response = await axios.post(`/store/buy`, { userId, equipmentName, equipmentIndex, equipmentUrl });
      const updatedEquipment = (activeTab === 'equipment' ? equipment : magicItems).map(item =>
        item.name === equipmentName ? { ...item, owned: item.owned + 1 } : item
      );

      if (activeTab === 'equipment') setEquipment(updatedEquipment);
      else setMagicItems(updatedEquipment);
      
      await fetchGold();
      toast({
        title: 'Purchase Successful',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error buying equipment:', error);
    }
  };

  const handleSell = async (equipmentName: string) => {
    try {
      const response = await axios.post(`/store/sell`, { userId, equipmentName });

      const updatedEquipment = (activeTab === 'equipment' ? equipment : magicItems).map(item =>
        item.name === equipmentName && item.owned > 0
          ? { ...item, owned: item.owned - 1 }
          : item
      );

      if (activeTab === 'equipment') setEquipment(updatedEquipment);
      else setMagicItems(updatedEquipment);

      await fetchGold();
      toast({
        title: 'Sell Successful',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error selling equipment:', error);
      toast({
        title: 'Error',
        description: 'Failed to sell the item.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const filtered = (activeTab === 'equipment' ? equipment : magicItems).filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (activeTab === 'equipment') setFilteredEquipment(filtered);
    else setFilteredMagicItems(filtered);
  }, [searchTerm, equipment, magicItems, activeTab]);

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

  const totalPages = Math.ceil(
    (activeTab === 'equipment' ? filteredEquipment : filteredMagicItems).length / itemsPerPage
  );
  
  const paginatedItems = (activeTab === 'equipment' ? filteredEquipment : filteredMagicItems)
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderCards = (items: Equipment[]) => (
    <SimpleGrid columns={5} spacing={5}>
      {items.map((item) => (
        <Card
          key={item.index}
          onClick={() => handleCardClick(item.index)}
          p={5}
          bg="yellow.400"
          color="black"
          cursor="pointer"
          height={selectedIndex === item.index ? 'auto' : '150px'}
          _hover={{
            transform: selectedIndex === item.index ? 'none' : 'scale(1.05)',
            transition: '0.3s',
            boxShadow: 'lg',
          }}
          position="relative"
          boxShadow="md"
        >
          <Flex justify="space-between" align="center">
            {/* Tooltip for the full item name */}
            <Tooltip label={item.name} placement="top" hasArrow>
              <Text fontWeight="bold" isTruncated maxWidth="200px">
                {item.name}
              </Text>
            </Tooltip>
          </Flex>
  
          {/* Display item details if selected */}
          {selectedIndex === item.index && selectedEquipmentDetails && (
            <Box mt={2}>
              <Flex justify="space-between" mt={4}>
                <Text mt={2} fontWeight="bold"> Cost: {selectedEquipmentDetails.cost.quantity} </Text>
                <Text fontWeight="bold"> Owned: {item.owned}</Text>
              </Flex>
              <Text mt={2} color="gray.800"> {selectedEquipmentDetails.desc.join(' ')} </Text>
            </Box>
          )}
  
          {/* Cost and Owned Text in the same row */}
          {/* <Flex justify="space-between" mt={4}>
            <Text fontWeight="bold">Cost: 50 gold</Text>
            <Text fontWeight="bold">Owned: {item.owned}</Text>
          </Flex> */}
  
          {/* Full-width Buy and Sell buttons */}
          <Flex gap={4} mt={4}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSell(item.name);
              }}
              colorScheme="red"
              size="md"
              width="100%"
              isDisabled={item.owned === 0}
            >
              Sell
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Item:', item);
                handleBuy(item.name, item.index, item.url);
              }}
              colorScheme="green"
              size="md"
              width="100%"
            >
              Buy
            </Button>
          </Flex>
        </Card>
      ))}

      {/* Display loading bar if loading */}
      {loading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
        >
          <Progress size="lg" isIndeterminate colorScheme="orange" width="500px" height="25px"/>
        </Flex>
      )}
    </SimpleGrid>
  );   

  return (
    <Box mt={10} px={4} maxWidth="100%" overflow="hidden">
      <Flex justify="space-between" align="center" mb={3}>
        <Input
          placeholder="Search for equipment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mt={8}
          width="50%"
          boxShadow="md"
        />
        {gold !== null ? (
          <Text fontSize="lg" fontWeight="bold" mt={8}>Gold: {gold}</Text>
        ) : (
          <Text fontSize="lg">Loading gold...</Text>
        )}
      </Flex>

      <Tabs onChange={(index) => {
        setActiveTab(index === 0 ? 'equipment' : 'magicItems');
        setCurrentPage(1);
      }} variant="enclosed">
        <TabList>
          <Tab>Equipment</Tab>
          <Tab>Magic Items</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {renderCards(paginatedItems)}
          </TabPanel>
          <TabPanel>
            {renderCards(paginatedItems)}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box mt={5} textAlign="center">
        {!loading && (
          <>
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              mr={2}
              bg="orange.300"
              _hover={{ bg: "orange.300" }}
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
              bg="orange.300"
              _hover={{ bg: "orange.300" }}
            >
              Next
            </Button>
          </>
        )}
      </Box>

      <Flex justifyContent="center" mt={4}>
        {!loading && (
          Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              size="xs"
              mx={1}
              bg={page === currentPage ? "orange.300" : "yellow.400"}
              _hover={{ bg: "orange.300" }}
              disabled={page === currentPage}
              border="none"
            >
              {page}
            </Button>
          ))
        )}
      </Flex>
    </Box>
  );
};

export default Store;
