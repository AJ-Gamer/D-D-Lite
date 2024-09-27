import express, { Request, Response } from 'express';
import axios from 'axios';

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

export default storeRouter;
