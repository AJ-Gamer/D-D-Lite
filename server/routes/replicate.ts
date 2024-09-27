import { Router, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/.env` });
const replicate = Router();

interface GenImgRequest {
  prompt: string;
}

interface ReplicateRes {
  output: string;
}

replicate.post('/gen-image', async (
  req: Request<object, object, GenImgRequest>,
  res: Response,
) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt Required' });
  }
  try {
    const response: AxiosResponse<ReplicateRes> = await axios.post(
      'https://api.replicate.com/v1/predictions',
      { version: process.env.REPLICATE_MODEL_VERSION, input: { prompt } },
      {
        headers:
        {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        },
      },
    );
    const imgUrl = response.data.output;
    return res.json({ imgUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Image Gen Failed' });
  }
});

export default replicate;
