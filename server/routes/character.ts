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
  class: string;
  race: string;
  image: string;
  userId: number;
}

interface FetchUserId {
  userId: number;
}

character.get('/all', async (
  req: Request<object, object, FetchUserId>,
  res: Response,
) => {
  const { userId } = req.body;
  try {
    const characters = await prisma.character.findMany({
      where: {
        userId,
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

export default character;
