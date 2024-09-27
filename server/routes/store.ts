import express, { Request, Response } from 'express';
import axios from 'axios';

const storeRouter = express.Router();

// Route to fetch equipment from the D&D 5e API
storeRouter.get('/equipment', async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://www.dnd5eapi.co/api/equipment');
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipment data' });
  }
});

export default storeRouter;
