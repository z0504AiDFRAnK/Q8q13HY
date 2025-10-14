// 代码生成时间: 2025-10-15 01:34:23
import express, { Request, Response } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Define the configuration for express-session middleware
const sessionConfig = {
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } // 24 hours
};

// Initialize the Express app
const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(session(sessionConfig));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Login endpoint
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  // TODO: Implement the actual authentication logic
  if (username === 'admin' && password === 'password') {
    req.session.userId = username; // Set the user session
    return res.status(200).json({ message: 'Logged in successfully' });
  } else {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Middleware to check if the user is authenticated
app.use((req: Request, res: Response, next: Function) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login'); // Redirect to login page if not authenticated
  }
});

// Protected endpoint
app.get('/dashboard', (req: Request, res: Response) => {
  res.send('Welcome to the dashboard');
});

// Logout endpoint
app.get('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login'); // Redirect to login page after logout
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SSO server is running on port ${PORT}`);
});