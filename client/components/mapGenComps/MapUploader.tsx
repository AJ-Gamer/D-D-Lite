import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

interface MapUploaderProps {
  imgDataUrl: string;
  userId: number | undefined;
}

interface Map {
  key: string;
  url: string;
}

const MapUploader: FC<MapUploaderProps> = ({ imgDataUrl, userId }) => {
  const toast = useToast();
  const [mapName, setMapName] = useState<string>('');
  const [maps, setMaps] = useState<Map[]>([]);

  const uploadMap = async () => {
    if (!imgDataUrl || !mapName) return;

    try {
      await axios.post('/api/upload', {
        imageData: imgDataUrl,
        fileName: `${mapName}.png`,
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast({
        title: 'Map uploaded successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to upload', error);

      toast({
        title: 'Failed to upload the map',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserMaps = async () => {
    if (!userId) return;

    try {
      const response = await axios.get('/api/maps');
      setMaps(response.data as Map[]);
    } catch (error) {
      console.error('Failed to fetch Maps', error);
    }
  };

  useEffect(() => {
    fetchUserMaps();
  }, [fetchUserMaps, userId]);

  return (
    <VStack>
      <Input
        placeholder="Enter Map Name"
        value={mapName}
        onChange={(e) => setMapName(e.target.value)}
      />
      <Button colorScheme="teal" onClick={uploadMap} isDisabled={!imgDataUrl || !mapName}>
        Save This Map
      </Button>
      <Box mt={4} w="full">
        <Text fontSize="lg" fontWeight="bold" color="#E6AD28">Your Saved Maps</Text>
        {maps.length > 0 ? (
          <HStack spacing={2} mt={2} align="start">
            {maps.map((map) => (
              <Box key={map.key} p={2} borderWidth={1} borderRadius="md" w="33%" bg="#E6AD28">
                <Text>
                  <a href={map.url} target="_blank" rel="noopener noreferrer">{map.key}</a>
                </Text>
                <img src={map.url} alt={map.key} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
              </Box>
            ))}
          </HStack>
        ) : (
          <Text>Upload some Maps.</Text>
        )}
      </Box>
    </VStack>
  );
};

export default MapUploader;