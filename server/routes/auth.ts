import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { User } from '@prisma/client';
import prisma from './prisma';

dotenv.config();

const auth = express.Router();
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

passport.use(new GoogleStrategy({
  clientID: `${GOOGLE_CLIENT_ID}`,
  clientSecret: `${GOOGLE_CLIENT_SECRET}`,
  callbackURL: `${GOOGLE_CALLBACK_URL}`,
}, (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (error: null, user?: User) => void,
) => {
  prisma.user.findUnique({ where: { googleId: profile.id } })
    .then((user) => {
      if (!user) {
        return prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails?.[0].value ?? '',
            name: profile.displayName,
          },
        });
      }
      return user;
    })
    .then((user) => done(null, user))
    .catch((err: null) => done(err));
}));

passport.serializeUser((user: object, done) => done(null, user));
passport.deserializeUser(async (id: number, done: (err: unknown, user?: User | null) => void) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

auth.get('/me', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        googleId: (req.user as { googleId: string }).googleId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

auth.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }) as (
  req: Request,
  res: Response,
  next: NextFunction,
) => void);

auth.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/home',
  failureRedirect: '/login',
}) as (
  req: Request,
  res: Response,
  next: NextFunction,
) => void);

auth.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: 'Error destroying session' });
      }
      res.sendStatus(200);
    });
  });
});

auth.get('/check-auth', (req: Request, res: Response) => {
  res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});

export default auth;
