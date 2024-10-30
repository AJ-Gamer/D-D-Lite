import React, { FC, useEffect, useState } from 'react';
import {
  VStack,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

interface TTSProps {
  prompt: string;
}

const TTS: FC<TTSProps> = ({ prompt }) => {
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const toggleTextToSpeech = () => {
    if (isTTSActive) {
      window.speechSynthesis.cancel();
      setIsTTSActive(false);
    } else {
      const newUtterance = new SpeechSynthesisUtterance(prompt);
      newUtterance.pitch = 1;
      newUtterance.rate = 1;

      window.speechSynthesis.speak(newUtterance);
      setUtterance(newUtterance);
      setIsTTSActive(true);

      newUtterance.onend = () => {
        setIsTTSActive(false);
      };
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <VStack spacing={5} align="center">
      <Text fontSize="2xl" textAlign="center" maxW="60%">
        {prompt}
      </Text>
      <IconButton
        aria-label="Text to speech"
        onClick={toggleTextToSpeech}
        icon={isTTSActive ? <HiSpeakerWave /> : <HiSpeakerXMark />}
        variant="ghost"
      >
        {isTTSActive ? 'Stop Speaking' : 'Start Speaking'}
      </IconButton>
    </VStack>
  );
};

export default TTS;
