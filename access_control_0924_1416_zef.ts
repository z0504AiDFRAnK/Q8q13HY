// 代码生成时间: 2025-09-24 14:16:20
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Configuration variables (should be environment variables in production)
const SECRET_KEY = 'your_secret_key';
const ACCESS_TOKEN_EXPIRATION = '1h';

// Middleware to check for a valid access token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
};

// Access control middleware that checks if the user has admin rights
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send({
      message: 'Access denied: User does not have admin rights.'
    });
  }
};

// Express application
const app = express();

// Define a route that requires authentication and admin rights
app.get('/admin', authenticateToken, isAdmin, (req: Request, res: Response) => {
  res.send('Welcome admin! This is a protected route.');
});

// Define a route that only requires authentication
app.get('/profile', authenticateToken, (req: Request, res: Response) => {
  res.send('Welcome! This is a profile page.');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({
    message: err.message
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});