import React, { FC } from 'react';
import { Button } from '@chakra-ui/react';
import axios from 'axios';

interface MapUploaderProps {
  imgDataUrl: string;
}

const MapUploader: FC<MapUploaderProps> = ({ imgDataUrl }) => {
  const uploadMap = async () => {
    if (!imgDataUrl) return;

    try {
      await axios.post('/api/upload', {
        imageData: imgDataUrl,
        fileName: 'exampleMap.png',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to upload', error);
    }
  };

  return (
    <Button colorScheme="teal" onClick={uploadMap} isDisabled={!imgDataUrl}>
      Save This Map
    </Button>
  );
};

export default MapUploader;
