import express, { Request, Response } from 'express';
import axios from 'axios';
import prisma from './prisma';

const inventory = express.Router();

inventory.get('/:class', async (req: Request, res: Response) => {
  const { class: characterClass } = req.params;
  const userId = Number(req.query.userId);

  if (!userId) {
    console.log('Id Error Value:', userId);
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${characterClass}/starting-equipment`);
    const startingEquipment = response.data.starting_equipment;

    console.log('Starting Equipment:', startingEquipment);

    let inventory = await prisma.inventory.findFirst({
      where: { userId: userId },
    });

    if (!inventory) {
      inventory = await prisma.inventory.create({
        data: {
          userId: userId,
        },
      });
    }

    for (const item of startingEquipment) {
      const equipmentItem = item.equipment;
      const existingItem = await prisma.equipment.findFirst({
        where: {
          name: equipmentItem.name,
          inventoryId: inventory.id,
        },
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

    res.json({ startingEquipment });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch starting equipment' });
  }  
});

export default inventory;
