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

    const itemPromises = allEquipment.map(async (item: any) => {
      try {
        const itemDetails = await axios.get(`https://www.dnd5eapi.co/api/equipment/${item.index}`);
        return itemDetails.data;
      } catch (error) {
        console.error(`Error fetching details for ${item.index}:`, error);
        return null;
      }
    });

    const detailedItems = (await Promise.all(itemPromises)).filter(Boolean);

    const validCategories = ['weapon', 'armor'];
    const filteredItems = detailedItems.filter(item =>
      validCategories.includes(item.equipment_category.index)
    );

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

    const equipmentWithOwnership = filteredItems.map((item: any) => ({
      ...item,
      owned: ownedItems[item.name] || 0,
    }
  ));

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
    const response = await axios.get('https://www.dnd5eapi.co/api/magic-items');
    const allMagicItems = response.data.results;

    const itemPromises = allMagicItems.map(async (item: any) => {
      try {
        const itemDetails = await axios.get(`https://www.dnd5eapi.co/api/magic-items/${item.index}`);
        return itemDetails.data;
      } catch (error) {
        console.error(`Error fetching details for ${item.index}:`, error);
        return null;
      }
    });

    const detailedMagicItems = (await Promise.all(itemPromises)).filter(Boolean);

    const validCategories = ['weapon', 'armor'];
    const filteredMagicItems = detailedMagicItems.filter(item =>
      validCategories.includes(item.equipment_category.index)
    );

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

    const magicItemsWithOwnership = filteredMagicItems.map((item: any) => ({
      ...item,
      owned: ownedItems[item.name] || 0,
    }));

    res.json(magicItemsWithOwnership);
  } catch (error) {
    console.error('Error fetching magic item data:', error);
    res.status(500).json({ message: 'Error fetching magic item data' });
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
  const { userId, equipmentName, equipmentIndex, equipmentUrl, cost } = req.body;
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

    if (user.gold < cost) {
      return res.status(400).json({ message: 'Not enough gold to buy this item' });
    }

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

    await prisma.user.update({
      where: { id: userId },
      data: { gold: user.gold - cost },
    });

    res.json({ message: 'Equipment bought successfully' });
  } catch (error) {
    console.error('Error buying equipment:', error);
    res.status(500).json({ message: 'Error processing the purchase' });
  }
});

storeRouter.post('/sell', async (req: Request, res: Response) => {
  const { userId, equipmentName, cost } = req.body;
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
      data: { gold: user.gold + cost },
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
