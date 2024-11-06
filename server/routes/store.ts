import express, { Request, Response } from 'express';
import axios from 'axios';
import prisma from './prisma';

const storeRouter = express.Router();

storeRouter.get('/equipment', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string, 10);

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const response = await axios.get('https://www.dnd5eapi.co/api/equipment');
    const allEquipment = response.data.results;

    const inventory = await prisma.inventory.findFirst({
      where: { userId: userId },
      include: { equipment: true },
    });

    const ownedItems: { [key: string]: number } = {};
    if (inventory) {
      inventory.equipment.forEach(item => {
        ownedItems[item.name] = item.owned;
      });
    }

    const equipmentWithOwnership = allEquipment.map((item: any) => {
      return {
        ...item,
        owned: ownedItems[item.name] || 0,
      };
    });

    res.json(equipmentWithOwnership);
  } catch (error) {
    console.error('Error fetching equipment data:', error);
    res.status(500).json({ message: 'Error fetching equipment data' });
  }
});

storeRouter.get('/magic-items', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string, 10);

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const response = await axios.get('https://www.dnd5eapi.co/api/magic-items/');
    const allEquipment = response.data.results;

    const inventory = await prisma.inventory.findFirst({
      where: { userId: userId },
      include: { equipment: true },
    });

    const ownedItems: { [key: string]: number } = {};
    if (inventory) {
      inventory.equipment.forEach(item => {
        ownedItems[item.name] = item.owned;
      });
    }

    const equipmentWithOwnership = allEquipment.map((item: any) => {
      return {
        ...item,
        owned: ownedItems[item.name] || 0,
      };
    });

    res.json(equipmentWithOwnership);
  } catch (error) {
    console.error('Error fetching equipment data:', error);
    res.status(500).json({ message: 'Error fetching magical equipment data' });
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

storeRouter.get('/magic-items/:index', async (req: Request, res: Response) => {
  const { index } = req.params;
  try {
    const response = await axios.get(`https://www.dnd5eapi.co/api/magic-items/${index}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch specific magical item' });
  }
});

storeRouter.get('/gold', async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string, 10);

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

storeRouter.post('/buy', async (req: Request, res: Response) => {
  const { userId, equipmentName, equipmentIndex, equipmentUrl } = req.body;
  if (!userId || !equipmentName) {
    return res.status(400).json({ message: 'User ID, Equipment Name, and Equipment Type are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gold: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.gold < 50) {
      return res.status(400).json({ message: 'Not enough gold to buy this item' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { gold: user.gold - 50 },
    });

    const inventory = await prisma.inventory.findFirst({
      where: { userId: userId },
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    let equipmentType; 
    if (equipmentUrl.includes('equipment')) {
      const categoryResponse = await axios.get(`https://www.dnd5eapi.co/api/equipment/${equipmentIndex}`);
      equipmentType = categoryResponse.data.equipment_category.index;
    } else if (equipmentUrl.includes('magic-items')) {
      const categoryResponse = await axios.get(`https://www.dnd5eapi.co/api/magic-items/${equipmentIndex}`);
      equipmentType = categoryResponse.data.equipment_category.index;
    }

    const existingItem = await prisma.equipment.findFirst({
      where: {
        name: equipmentName,
        inventoryId: inventory.id,
      },
    });

    if (existingItem) {
      await prisma.equipment.update({
        where: { id: existingItem.id },
        data: { owned: existingItem.owned + 1 },
      });
    } else {
      await prisma.equipment.create({
        data: {
          name: equipmentName,
          inventoryId: inventory.id,
          owned: 1,
          type: equipmentType,
        },
      });
    }

    res.json({ message: 'Equipment bought successfully' });
  } catch (error) {
    console.error('Error buying equipment:', error);
    res.status(500).json({ message: 'Error processing the purchase' });
  }
});

storeRouter.post('/sell', async (req: Request, res: Response) => {
  const { userId, equipmentName } = req.body;
  if (!userId || !equipmentName) {
    return res.status(400).json({ message: 'User ID and Equipment Name are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gold: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const inventory = await prisma.inventory.findFirst({
      where: { userId: userId },
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const existingItem = await prisma.equipment.findFirst({
      where: {
        name: equipmentName,
        inventoryId: inventory.id,
      },
    });

    if (!existingItem || existingItem.owned <= 0) {
      return res.status(400).json({ message: 'You do not own this item' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { gold: user.gold + 50 },
    });

    await prisma.equipment.update({
      where: { id: existingItem.id },
      data: { owned: existingItem.owned - 1 },
    });

    res.json({ message: 'Equipment sold successfully' });
  } catch (error) {
    console.error('Error selling equipment:', error);
    res.status(500).json({ message: 'Error processing the sale' });
  }
});

export default storeRouter;
