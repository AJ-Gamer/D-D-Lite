/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
import React, {
  FC,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import p5 from 'p5';
import { Box, Button, HStack } from '@chakra-ui/react';

const MapGen: FC = () => {
  const zoom = 100;
  const sketchRef = useRef<HTMLDivElement | null>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [canvasSize, setCanvasSize] = useState<number>(600);

  const drawMap = useCallback((p: p5) => {
    p.randomSeed(p.random(10000));
    p.noiseSeed(p.random(10000));
    p.loadPixels();

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
  }, [zoom]);

  const genNewMap = useCallback((size: number) => {
    setCanvasSize(size);

    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(size, size);
        p.background(200);
        p.noLoop();
      };

      p.draw = () => {
        drawMap(p);
      };
    };
    if (sketchRef.current) {
      p5InstanceRef.current = new p5(sketch, sketchRef.current);
    }
  }, [drawMap]);

  useEffect(() => {
    genNewMap(canvasSize);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [canvasSize, genNewMap]);

  return (
    <Box justifyContent="center" p={5}>
      <HStack spacing={4} justify="center" mt={32} mb={4}>
        <Button colorScheme="teal" onClick={() => genNewMap(400)}>
          Generate a Small Map
        </Button>
        <Button colorScheme="teal" onClick={() => genNewMap(600)}>
          Generate a Medium Map
        </Button>
        <Button colorScheme="teal" onClick={() => genNewMap(800)}>
          Generate a Large Map
        </Button>
      </HStack>
      <Box ref={sketchRef} display="flex" justifyContent="center" m={4} />
    </Box>
  );
};

export default MapGen;
