/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { S3Client, PutObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRouter from './routes/auth';
import charRouter from './routes/character';
import storeRouter from './routes/store';
import replicateRouter from './routes/replicate';
import inventoryRouter from './routes/inventory';
import encountersRouter from './routes/encounters';

dotenv.config();
const PORT = 3000;
const DIST_DIR = path.resolve(__dirname, '../dist/client');
const app = express();
const {
  BUCKET_NAME,
  BUCKET_REGION,
  ACCESS_KEY,
  SECRET_ACCESS_KEY,
} = process.env;

app.use(bodyParser.json({ limit: '30mb' }));
app.use(express.json());
app.use(session({
  secret: 'secretTunnel',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/replicate', replicateRouter);
app.use('/character', charRouter);
app.use('/store', storeRouter);
app.use('/inventory', inventoryRouter);
app.use('/encounters', encountersRouter);

const s3 = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
});

interface UploadReqBody {
  imageData: string;
  fileName: string;
  userId: number;
}

app.post('/api/upload', async (
  req: Request<object, object, UploadReqBody>,
  res: Response,
) => {
  console.log(req.user);
  const { imageData, fileName, userId } = req.body;

  try {
    const base64Image = imageData.split(';base64,')[1];
    const buffer = Buffer.from(base64Image ?? '', 'base64');
    const uploadKey = `${userId}/${fileName}`;
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: uploadKey,
      Body: buffer,
      ContentType: 'image/png',
    };

    await s3.send(new PutObjectCommand(uploadParams));
    res.status(201).send('Successfully uploaded image');
  } catch (error) {
    console.error('Error uploading to s3', error);
    res.status(500).send('Failed to upload image');
  }
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: number;
      googleId: string,
      email: string,
      name: string,
    }
  }
}

app.get('/api/maps', async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const params = {
    Bucket: BUCKET_NAME,
    Prefix: `${userId}/`,
    Delimiter: '/',
  };

  try {
    const data = await s3.send(new ListObjectsCommand(params));

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(404).json({ message: 'No maps found' });
    }

    const maps = data.Contents.map((item) => ({
      key: item.Key,
      url: `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${item.Key}`,
    }));

    res.status(200).json(maps);
  } catch (error) {
    console.error('Error fetching maps from S3', error);
    res.status(500).json({ message: 'Failed to fetch maps' });
  }
});

const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

app.get('/', (req: Request, res: Response) => {
  res.redirect('/login');
});

app.get('/login', (req: Request, res: Response) => {
  res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.get('/home', isAuthenticated, (req, res) => {
  res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.use(express.static(DIST_DIR));

app.listen(PORT, () => {
  console.info(`Server listening at http://127.0.0.1:${PORT}`);
});
