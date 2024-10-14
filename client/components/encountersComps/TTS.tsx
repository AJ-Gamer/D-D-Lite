import React, { FC } from 'react';
import {
  VStack,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { LiaMicrophoneSolid, LiaMicrophoneSlashSolid } from 'react-icons/lia';

interface TTSProps {
  prompt: string;
  isTTSActive: boolean;
  toggleTextToSpeech: () => void;
}

const TTS: FC<TTSProps> = ({ prompt, isTTSActive, toggleTextToSpeech }) => (
  <VStack spacing={5} align="center">
    <Text fontSize="2xl" textAlign="center" maxW="60%">
      {prompt}
    </Text>
    <IconButton
      aria-label="Text to speech"
      onClick={toggleTextToSpeech}
      icon={isTTSActive ? <LiaMicrophoneSlashSolid /> : <LiaMicrophoneSolid />}
      variant="ghost"
    >
      {isTTSActive ? 'Stop Speaking' : 'Start Speaking'}
    </IconButton>
  </VStack>
);

export default TTS;
