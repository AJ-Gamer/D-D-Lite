// server/routes/inventory.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import prisma from './prisma';

const inventory = express.Router();

inventory.get('/:class', async (req: Request, res: Response) => {
  const { class: characterClass } = req.params;

  try {
    console.log({class: characterClass});
    const response = await axios.get(`https://www.dnd5eapi.co/api/classes/${characterClass}/starting-equipment`);
    const startingEquipment = response.data.starting_equipment;

    res.json({ startingEquipment });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Failed to fetch starting equipment' });
  }
});



export default inventory;
