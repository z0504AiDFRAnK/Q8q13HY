// 代码生成时间: 2025-09-30 02:28:24
import express, { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'crypto';

// Create an express application
const app = express();
app.use(express.json());

// Configure the OAuth2 client - replace with your client credentials
const oauth2Client = new OAuth2Client(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:3000/auth/login/callback'
);

// Generate a random state parameter to prevent CSRF attacks
const generateState = () => {
  return randomBytes(16).toString('hex');
};

// Endpoint to initiate the OAuth2 authorization flow
app.get('/auth/login', (req: Request, res: Response) => {
  const state = generateState();
  res.cookie('state', state, { httpOnly: true });
  const scope = 'https://www.googleapis.com/auth/userinfo.profile';
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scope,
    state: state,
  });
  res.redirect(url);
});

// Endpoint to handle the OAuth2 callback
app.get('/auth/login/callback', async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.state;
    if (state !== storedState) {
      // State does not match, likely a CSRF attack
      throw new Error('State mismatch, possible CSRF attack.');
    }

    // Get the OAuth2 token
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    res.clearCookie('state');
    res.redirect('/profile');
  } catch (error) {
    res.status(500).send('Authentication failed: ' + error.message);
  }
});

// Endpoint to display the user profile
app.get('/profile', async (req: Request, res: Response) => {
  try {
    const ticket = await oauth2Client.verifyIdToken(
      req.query.id_token as string,
      'YOUR_CLIENT_ID'
    );
    const profile = ticket.getPayload();
    res.send(`Hello, ${profile.name}! Welcome to your profile page!`);
  } catch (error) {
    res.status(401).send('Authentication required.');
  }
});

// Start the express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OAuth2 service running on port ${PORT}`);
});