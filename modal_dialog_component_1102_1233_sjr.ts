// 代码生成时间: 2025-11-02 12:33:04
 * Ensures maintainability and extensibility of the code.
 */

import express, { Request, Response } from 'express';
import { createServer } from 'vite';
import path from 'path';
import fs from 'fs';

// Define a constant to represent the port number where the Express server will run.
const PORT = 3000;

// Initialize the Express application.
const app = express();

// Middleware to serve static files from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to render the HTML page that includes the modal dialog component.
app.get('/', (req: Request, res: Response) => {
  // Serve the index.html file.
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Error handling middleware.
app.use((err: Error, req: Request, res: Response, next: Function) => {
  // Log the error for debugging purposes.
  console.error(err);
  // Send a generic error response to the client.
  res.status(500).send('An error occurred.');
});

// Start the Express server.
const startServer = async () => {
  try {
    await createServer({ preview: true });
    const viteServer = createServer({ preview: true });
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Start the server when the script is run.
startServer();
