import express, { Request, Response } from 'express';
import axios from 'axios';
import prisma from './prisma';

const storeRouter = express.Router();

storeRouter.get('/equipment', async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://www.dnd5eapi.co/api/equipment');
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment data' });
  }
});

storeRouter.get('/equipment/:index', async (req: Request, res: Response) => {
  const { index } = req.params;
  try {
    const response = await axios.get(`https://www.dnd5eapi.co/api/equipment/${index}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch specific equipment' });
  }
});

storeRouter.get('/gold', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string, 10);
  console.log('test:', userId);
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gold: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ gold: user.gold });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// New route to handle buying equipment
storeRouter.post('/buy', async (req: Request, res: Response) => {
  const { userId, equipmentId } = req.body;

  if (!userId || !equipmentId) {
    return res.status(400).json({ message: 'User ID and equipment ID are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { inventory: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let inventory = user.inventory[0];

    if (!inventory) {
      inventory = await prisma.inventory.create({
        data: { userId: user.id },
      });
    }

    let equipment = await prisma.equipment.findFirst({
      where: { inventoryId: inventory.id, id: equipmentId },
    });

    const itemPrice = 50;

    if (user.gold < itemPrice) {
      return res.status(400).json({ message: 'Not enough gold to buy this item' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { gold: { decrement: itemPrice } },
    });

    if (equipment) {
      equipment = await prisma.equipment.update({
        where: { id: equipment.id },
        data: { owned: { increment: 1 } },
      });
    } else {
      equipment = await prisma.equipment.create({
        data: {
          name: `Equipment Name`,
          description: `Equipment Description`,
          inventoryId: inventory.id,
          owned: 1,
        },
      });
    }

    res.status(200).json({ message: 'Item bought successfully', equipment });
  } catch (error) {
    res.status(500).json({ message: 'Error processing purchase', error });
  }
});

export default storeRouter;
