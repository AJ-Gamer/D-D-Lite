import React, { FC } from 'react';
import {
  Box,
  Image,
} from '@chakra-ui/react';

interface CharGenProps {
  imageUrl: string | null;
}

const CharGen: FC<CharGenProps> = ({ imageUrl }) => (
  <Box textAlign="center">
    {imageUrl && <Image src={imageUrl} alt="Generated Portrait" />}
  </Box>
);

export default CharGen;
