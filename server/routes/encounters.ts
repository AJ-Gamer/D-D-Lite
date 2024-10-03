import express, { Request, Response } from 'express';
import prisma from './prisma';

const encounters = express.Router();

encounters.get('/story/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`Fetching story node with ID: ${id}`);
  try {
    const storyNode = await prisma.storyNode.findUnique({
      where: { id: Number(id) },
      include: {
        options: true,
      },
    });

    if (!storyNode) {
      return res.status(404).json({ error: 'Story node not found' });
    }

    res.json(storyNode);
  } catch (error) {
    console.error('Server error fetching story node:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default encounters;
