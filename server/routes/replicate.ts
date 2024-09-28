import { Router, Request, Response } from 'express';
import Replicate from 'replicate';
import dotenv from 'dotenv';
import prisma from './prisma';

dotenv.config();
const replicate = Router();
const { REPLICATE_API_KEY } = process.env;
const repl = new Replicate({ auth: REPLICATE_API_KEY });

interface GenImgRequest {
  prompt: string;
  characterId: number;
}

replicate.post('/gen-image', async (
  req: Request<object, object, GenImgRequest>,
  res: Response,
) => {
  const { prompt, characterId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt Required' });
  }
  try {
    const input = {
      width: 856,
      height: 1156,
      prompt,
      output_format: 'png',
      output_quality: 100,
      num_inference_steps: 25,
    };
    const output = await repl.run(
      'bingbangboom-lab/flux-new-whimscape:2e8de10f217bc56da163a0204cf09f89995eaf643459014803fae79753183682',
      { input },
    );

    const imgUrl = output;

    return res.json({ imgUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Image Gen Failed' });
  }
});

export default replicate;
