import express, { Request, Response } from 'express';
import axios from 'axios';
import prisma from './prisma';

const inventory = express.Router();

const validClasses = ['sorcerer', 'rogue', 'barbarian'];

inventory.get('/allEquipment', async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);
  console.log('User Id:', userId);
  if (!userId) {
    console.log('Id Error Value:', userId);
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
   let inventory = await prisma.inventory.findFirst({
      where: { userId: userId },
    });
    console.log('Full Inventory:', inventory);
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
      const existingItem = await prisma.equipment.findFirst({
        where: { name: equipmentItem.name, inventoryId: inventory.id },
      });

      if (!existingItem) {
        await prisma.equipment.create({
          data: {
            name: equipmentItem.name,
            description: item.description || null,
            inventoryId: inventory.id,
            owned: item.quantity || 1,
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

export default inventory;
