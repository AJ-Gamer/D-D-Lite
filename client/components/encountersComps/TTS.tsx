import React, { FC, useEffect, useState } from 'react';
import {
  VStack,
  Text,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';

interface TTSProps {
  prompt: string;
}

const TTS: FC<TTSProps> = ({ prompt }) => {
  const [isTTSActive, setIsTTSActive] = useState<boolean>(() => {
    const storedState = localStorage.getItem('isTTSActive');
    return storedState ? JSON.parse(storedState) : false;
  });
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const { colorMode } = useColorMode();

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
    localStorage.setItem('isTTSActive', JSON.stringify(isTTSActive));
  }, [isTTSActive]);

  useEffect(() => () => {
    window.speechSynthesis.cancel();
  }, []);

  return (
    <VStack spacing={5} align="center">
      <Text
        fontSize="2xl"
        textAlign="center"
        outline="1px solid"
        bg={colorMode === 'light' ? 'gray.400' : 'gray.600'}
        px={2}
        fontWeight="bold"
        fontFamily="'Cinzel', serif"
      >
        {prompt}
      </Text>
      <IconButton
        aria-label="Text to speech"
        onClick={toggleTextToSpeech}
        icon={isTTSActive ? <HiSpeakerWave /> : <HiSpeakerXMark />}
        variant="ghost"
        outline="2px solid black" // Outline around the icon
        bg={isTTSActive ? 'yellow.400' : 'transparent'} // Optional: background color when active
        colorScheme={isTTSActive ? 'yellow' : 'gray'} // Optional: icon color when active
      />
    </VStack>
  );
};

export default TTS;
