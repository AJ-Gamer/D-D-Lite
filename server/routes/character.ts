import { Router, Request, Response } from 'express';
import { Character, Weapon } from '@prisma/client';
import prisma from './prisma';

const character = Router();

const allowedClasses = ['barbarian', 'rogue', 'sorcerer'];
type CharacterClass = typeof allowedClasses[number];
const startingWeapons: Record<CharacterClass, string> = {
  barbarian: 'warhammer', // starting weapon equipment
  rogue: 'crossbow-light',
  sorcerer: 'quarterstaff',
};

interface CreateCharReq {
  name: string;
  description: string;
  class: string;
  race: string;
  image: string;
  userId: number;
}

interface UpdateCharReq {
  image: string;
}

interface FetchUserId {
  userId: number;
}

character.get('/all', async (
  req: Request<object, object, FetchUserId>,
  res: Response,
) => {
  const { userId } = req.query;
  try {
    const characters = await prisma.character.findMany({
      where: {
        userId: Number(userId),
      },
    });
    return res.json({ characters });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

character.post('/create', async (
  req: Request<object, object, CreateCharReq>,
  res: Response,
) => {
  const {
    name,
    description,
    class: characterClass,
    race,
    image,
    userId,
  } = req.body;
  const startingWeaponName = startingWeapons[characterClass];

  try {
    const characterCount = await prisma.character.count({
      where: { userId },
    });

    if (characterCount >= 4) {
      return res.status(403).json({ error: 'Character Limit Reached' });
    }

    const newChar: Character = await prisma.character.create({
      data: {
        name,
        description,
        class: characterClass,
        race,
        constitution: 10,
        strength: 10,
        dexterity: 10,
        charisma: 10,
        image,
        user: {
          connect: { id: userId },
        },
      },
    });

    const startingWeapon: Weapon = await prisma.weapon.create({
      data: {
        name: startingWeaponName,
        damage: 2,
        rarity: 'common',
        characters: {
          connect: { id: newChar.id },
        },
      },
    });
    return res.status(201).json({ newChar, startingWeapon });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create character' });
  }
});

character.put('/:id/update', async (
  req: Request<{ id: string }, object, UpdateCharReq>,
  res: Response,
) => {
  const { id } = req.params;
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Image Url required' });
  }
  try {
    const characterId = parseInt(id, 10);
    const imageUrl = image[0];
    const updatedChar = await prisma.character.update({
      where: { id: characterId },
      data: { image: imageUrl },
    });
    res.json(updatedChar);
  } catch (error) {
    console.error('Error updating character image:', error);
    res.status(500).json({ error: 'Failed to update character image' });
  }
});

character.delete('/:id', async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  try {
    const characterId = parseInt(id, 10);
    await prisma.character.delete({ where: { id: characterId } });

    return res.status(200).json({ message: 'Character Deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete character' });
  }
});

export default character;
