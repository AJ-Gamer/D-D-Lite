import express, { Request, Response } from 'express';
import axios from 'axios';
import prisma from './prisma';

const inventory = express.Router();

const validClasses = ['sorcerer', 'rogue', 'barbarian'];

inventory.get('/allEquipment', async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  if (!userId) {
    console.log('Id Error Value:', userId);
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
   let inventory = await prisma.inventory.findFirst({
      where: { userId: userId },
    });

    const allEquipment = await prisma.equipment.findMany({
      where: {
        inventoryId: inventory?.id,
      },
    });

    res.status(200).json({ allEquipment });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch all equipment' });
  }
});

inventory.get('/:class', async (req: Request, res: Response) => {
  const { class: characterClass } = req.params;
  const userId = Number(req.query.userId);

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!validClasses.includes(characterClass)) {
    console.error(`Invalid class requested: ${characterClass}`);
    return res.status(400).json({ error: `Invalid class: ${characterClass}` });
  }

  try {
    const response = await axios.get(
      `https://www.dnd5eapi.co/api/classes/${characterClass}/starting-equipment`
    );

    const startingEquipment = response.data.starting_equipment;
    if (!Array.isArray(startingEquipment)) {
      console.error('Invalid starting equipment format:', startingEquipment);
      return res.status(500).json({ error: 'Invalid starting equipment format' });
    }

    let inventory = await prisma.inventory.findFirst({ where: { userId } });
    if (!inventory) {
      inventory = await prisma.inventory.create({ data: { userId } });
    }

    for (const item of startingEquipment) {
      const equipmentItem = item.equipment;
      const categoryResponse = await axios.get(`https://www.dnd5eapi.co/api/equipment/${equipmentItem.index}`);
      const equipmentCategory = categoryResponse.data.equipment_category.index;
      const existingItem = await prisma.equipment.findFirst({
        where: { name: equipmentItem.name, inventoryId: inventory.id },
      });

      if (!existingItem) {
        await prisma.equipment.create({
          data: {
            name: equipmentItem.name,
            description: item.desc || null,
            inventoryId: inventory.id,
            owned: item.quantity || 1,
            type: equipmentCategory,
          },
        });
      }
    }

    res.status(200).json({ startingEquipment });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch starting equipment' });
  }
});

inventory.delete('/deleteSold', async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const inventory = await prisma.inventory.findFirst({
      where: { userId: Number(userId) },
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    await prisma.equipment.deleteMany({
      where: {
        inventoryId: inventory.id,
        owned: 0,
      },
    });

    res.json({ message: 'Equipment with zero quantity deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

inventory.patch('/equipWeapon', async (req: Request, res: Response) => {
  const { itemName, characterId } = req.body;

  if (!characterId || !itemName) {
    return res.status(400).json({ error: 'Character ID and item name are required' });
  }

  try {
    // Find or create the weapon by name
    const weapon = await prisma.weapon.upsert({
      where: { name: itemName }, // Use 'name' as a unique field
      update: {}, // No update needed if found
      create: { name: itemName }
    });

    // Associate weapon with the character
    await prisma.character.update({
      where: { id: characterId },
      data: {
        weapon: {
          connect: { id: weapon.id },
        },
      },
    });

    res.status(200).json({ message: `Weapon ${weapon.name} equipped successfully.` });
  } catch (error) {
    console.error('Error equipping weapon:', error);
    res.status(500).json({ error: 'Failed to equip weapon' });
  }
});

inventory.patch('/equipArmor', async (req: Request, res: Response) => {
  const { itemName, characterId } = req.body;

  if (!characterId || !itemName) {
    return res.status(400).json({ error: 'Character ID and item name are required' });
  }

  try {
    // Find or create the armor by name
    const armor = await prisma.armor.upsert({
      where: { name: itemName },
      update: {}, // No update needed if found
      create: { name: itemName }
    });

    // Associate armor with the character
    await prisma.character.update({
      where: { id: characterId },
      data: {
        armor: {
          connect: { id: armor.id },
        },
      },
    });

    res.status(200).json({ message: `Armor ${armor.name} equipped successfully.` });
  } catch (error) {
    console.error('Error equipping armor:', error);
    res.status(500).json({ error: 'Failed to equip armor' });
  }
});

export default inventory;
