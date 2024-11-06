import express, { Request, Response } from 'express';
import prisma from './prisma';

const encounters = express.Router();

encounters.get('/story/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const storyNode = await prisma.storyNode.findUnique({
      where: { id: Number(id) },
      include: {
        options: {
          select: {
            id: true,
            text: true,
            nextNodeId: true,
            result: true,
            statCheck: { // Select statCheck details
              select: {
                stat: true,
                difficulty: true,
              },
            },
          },
        },
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

encounters.post('/saveProgress', async (req: Request, res: Response) => {
  const { userId, characterId, storyNodeId } = req.body;

  try {
    const existingProgress = await prisma.userStoryProgress.findUnique({
      where: {
        userId_characterId: {
          userId,
          characterId,
        },
      },
    });

    if (existingProgress) {
      await prisma.userStoryProgress.update({
        where: { id: existingProgress.id },
        data: { currentNodeId: storyNodeId },
      });
      return res.json({ message: 'Progress updated successfully.' });
    } else {
      await prisma.userStoryProgress.create({
        data: {
          userId,
          characterId,
          currentNodeId: storyNodeId,
        },
      });
      return res.json({ message: 'Progress created successfully.' });
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

encounters.get('/loadProgress', async (req: Request, res: Response) => {
  const { userId, characterId } = req.params;

  try {
    const progress = await prisma.userStoryProgress.findUnique({
      where: {
        userId_characterId: {
          userId: Number(userId),
          characterId: Number(characterId),
        },
      },
    });

    if (!progress) {
      return res.status(404).json({ error: 'Progress not found for this user and character.' });
    }

    const currentNode = await prisma.storyNode.findUnique({
      where: { id: progress.currentNodeId },
      include: {
        options: true,
      },
    });

    if (!currentNode) {
      return res.status(404).json({ error: 'Current story node not found.' });
    }

    res.json(currentNode);
  } catch (error) {
    console.error('Error fetching current story node:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default encounters;
