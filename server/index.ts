/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import authRouter from './routes/auth';
import charRouter from './routes/character';
import storeRouter from './routes/store';
import replicateRouter from './routes/replicate';

const PORT = 3000;
const DIST_DIR = path.resolve(__dirname, '../dist/client');
const app = express();

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
