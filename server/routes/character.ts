import { Router, Request, Response } from 'express';
import { Character, Weapon } from '@prisma/client';
import prisma from './prisma';

const character = Router();

const allowedClasses = ['barbarian', 'rogue', 'sorcerer'];
type CharacterClass = typeof allowedClasses[number];

const startingWeapons: Record<CharacterClass, string> = {
  barbarian: 'warhammer',
  rogue: 'crossbow-light',
  sorcerer: 'quarterstaff',
};

// Define valid stat keys
type StatKey = 'constitution' | 'strength' | 'dexterity' | 'charisma';

interface CharacterStats {
  constitution: number;
  strength: number;
  dexterity: number;
  charisma: number;
}

// Race bonuses
const raceBonuses: Record<string, Partial<CharacterStats>> = {
  human: { charisma: 2 },
  elf: { dexterity: 2 },
  dragonborn: { constitution: 2 },
};

// Class bonuses
const classBonuses: Record<CharacterClass, Partial<CharacterStats>> = {
  barbarian: { strength: 3, constitution: 2 },
  rogue: { dexterity: 2, charisma: 3 },
  sorcerer: { constitution: 3, charisma: 2 },
};

// Utility function to apply stat bonuses
const applyBonus = (
  currentStats: CharacterStats,
  bonus: Partial<CharacterStats>
): CharacterStats => {
  return Object.entries(bonus).reduce((acc, [key, value]) => {
    const statKey = key as StatKey; // Ensure TypeScript knows this is a valid key
    acc[statKey] += value ?? 0;
    return acc;
  }, { ...currentStats });
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
  const startingWeaponName = startingWeapons[characterClass as CharacterClass];

  try {
    const characterCount = await prisma.character.count({
      where: { userId },
    });

    if (characterCount >= 4) {
      return res.status(403).json({ error: 'Character Limit Reached' });
    }

    // Initialize base stats (all 10)
    let stats: CharacterStats = {
      constitution: 10,
      strength: 10,
      dexterity: 10,
      charisma: 10,
    };

    // Apply race bonus
    const raceBonus = raceBonuses[race.toLowerCase()];
    if (raceBonus) stats = applyBonus(stats, raceBonus);

    // Apply class bonus
    const classBonus = classBonuses[characterClass as CharacterClass];
    stats = applyBonus(stats, classBonus);

    // Create character with calculated stats
    const newChar: Character = await prisma.character.create({
      data: {
        name,
        description,
        class: characterClass,
        race,
        constitution: stats.constitution,
        strength: stats.strength,
        dexterity: stats.dexterity,
        charisma: stats.charisma,
        image,
        user: { connect: { id: userId } },
      },
    });

    const startingWeapon: Weapon = await prisma.weapon.create({
      data: {
        name: startingWeaponName,
        // damage: 2,
        // rarity: 'common',
        characters: {
          connect: { id: newChar.id },
        },
      },
    });
    return res.status(201).json({ newChar });
  } catch (error) {
    console.error('Error creating character:', error);
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
