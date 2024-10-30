/* eslint-disable no-restricted-syntax */
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
import {
  Box,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import MapUploader from './mapGenComps/MapUploader';

interface TT {
  minHeight: number;
  maxHeight: number;
  minColor: p5.Color;
  maxColor: p5.Color;
  lerpAdj: number;
}

interface MapGenProps {
  userId: number | undefined;
}

const MapGen: FC<MapGenProps> = ({ userId }) => {
  const toast = useToast();
  const sketchRef = useRef<HTMLDivElement | null>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [canvasSize, setCanvasSize] = useState<number>(600);
  const [imgDataUrl, setImgDataUrl] = useState<string>('');
  const terrains = useRef<TT[]>([]);
  const zoom = 100;

  const createTerrainType = useCallback((
    p: p5,
    minHeight: number,
    maxHeight: number,
    minColor: [number, number, number],
    maxColor: [number, number, number],
    lerpAdj = 0,
  ): TT => ({
    minHeight,
    maxHeight,
    minColor: p.color(minColor[0], minColor[1], minColor[2]),
    maxColor: p.color(maxColor[0], maxColor[1], maxColor[2]),
    lerpAdj,
  }), []);

  const initTerrains = useCallback((p: p5) => {
    terrains.current = [
      createTerrainType(p, 0.15, 0.35, [30, 176, 251], [40, 255, 255]), // Water
      createTerrainType(p, 0.35, 0.4, [215, 192, 158], [255, 246, 193], 0.3), // Sand
      createTerrainType(p, 0.4, 0.6, [2, 166, 155], [118, 239, 124]), // Grass
      createTerrainType(p, 0.6, 0.65, [22, 181, 141], [10, 145, 113], 0.3), // Forest
      createTerrainType(p, 0.65, 0.75, [150, 150, 150], [180, 180, 180]), // Mountain
      createTerrainType(p, 0.75, 0.95, [250, 250, 250], [255, 255, 255], -0.5), // SnowCapped
    ];
  }, [createTerrainType]);

  const drawMap = useCallback((p: p5) => {
    if (terrains.current.length === 0) return;
    p.randomSeed(p.random(10000));
    p.noiseSeed(p.random(10000));
    p.loadPixels();

    const normalize = (value: number, max: number, min: number) => {
      if (value > max) return 1;
      if (value < min) return 0;
      return (value - min) / (max - min);
    };

    const getTerrainColor = (noiseValue: number, terrainType: TT) => {
      const normalized = normalize(noiseValue, terrainType.maxHeight, terrainType.minHeight);
      return p.lerpColor(
        terrainType.minColor,
        terrainType.maxColor,
        normalized + terrainType.lerpAdj,
      );
    };

    for (let x = 0; x < p.width; x += 1) {
      for (let y = 0; y < p.height; y += 1) {
        const noiseValue = p.noise(x / zoom, y / zoom);
        let terrainColor;

        for (const terrain of terrains.current) {
          if (noiseValue < terrain.maxHeight) {
            terrainColor = getTerrainColor(noiseValue, terrain);
            break;
          }
        }
        if (!terrainColor) {
          terrainColor = getTerrainColor(noiseValue, terrains.current[terrains.current.length - 1]);
        }
        p.set(x, y, terrainColor);
      }
    }
    p.updatePixels();
  }, [terrains]);

  const genNewMap = useCallback((size: number) => {
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
    setCanvasSize(size);

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(size, size);
        initTerrains(p);
        p.noiseDetail(9, 0.5);
        p.noLoop();
      };

      p.draw = () => {
        drawMap(p);
      };
    };
    if (sketchRef.current) {
      p5InstanceRef.current = new p5(sketch, sketchRef.current);
    }
  }, [drawMap, initTerrains]);

  useEffect(() => {
    genNewMap(canvasSize);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [canvasSize, genNewMap]);

  const capMapScreenshot = () => {
    const canvas = document.querySelector('canvas');

    if (canvas) {
      setImgDataUrl(canvas.toDataURL('image/png'));
      toast({
        title: 'Map screenshot captured.',
        description: 'Your map has been successfully captured and is ready to be uploaded!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error capturing map.',
        description: 'There was an issue capturing your map. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box justifyContent="center" p={5} maxWidth="1000px" mx="auto">
      <HStack spacing={4} justify="center" mt={16} mb={4}>
        <Button onClick={() => genNewMap(400)}>
          Generate a Small Map
        </Button>
        <Button onClick={() => genNewMap(600)}>
          Generate a Medium Map
        </Button>
        <Button onClick={() => genNewMap(800)}>
          Generate a Large Map
        </Button>
      </HStack>
      <Box ref={sketchRef} display="flex" justifyContent="center" m={4} />
      <Button onClick={capMapScreenshot} mb={2}>
        Send Map Data
      </Button>
      <MapUploader userId={userId} imgDataUrl={imgDataUrl} />
    </Box>
  );
};

export default MapGen;
