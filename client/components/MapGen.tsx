/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import p5 from 'p5';
import { Box, Button } from '@chakra-ui/react';

const MapGen: FC = () => {
  const zoom = 100;
  const sketchRef = useRef<HTMLDivElement | null>(null);
  const [seed, setSeed] = useState(Math.random());

  useEffect(() => {
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(600, 600);
        p.background(200);
        p.noLoop();
      };

      p.draw = () => {
        p.randomSeed(seed);
        p.noiseSeed(seed);

        for (let x = 0; x < p.width; x += 1) {
          for (let y = 0; y < p.height; y += 1) {
            const noiseValue = p.noise(x / zoom, y / zoom);
            let terrainColor;

            if (noiseValue < 0.50) {
              terrainColor = p.color(30, 176, 251);
            } else if (noiseValue < 0.53) {
              terrainColor = p.color(255, 246, 193);
            } else if (noiseValue < 0.65) {
              terrainColor = p.color(118, 239, 124);
            } else {
              terrainColor = p.color(22, 181, 141);
            }
            p.set(x, y, terrainColor);
          }
        }
        p.updatePixels();
      };
    };
    const p5Instance = new p5(sketch, sketchRef.current as HTMLElement);
    return () => {
      p5Instance.remove();
    };
  }, [seed]);

  const genNewMap = () => {
    setSeed(Math.random());
  };

  return (
    <Box justifyContent="center" p={5}>
      <Button colorScheme="teal" size="lg" onClick={genNewMap} mt={32}>
        Generate a New Map
      </Button>
      <Box ref={sketchRef} m={4} />
    </Box>
  );
};

export default MapGen;
