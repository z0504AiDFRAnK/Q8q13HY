// 代码生成时间: 2025-10-10 23:35:33
import express from 'express';
import axios from 'axios';
import { setTimeout as delay } from 'timers/promise';

// Constants for the monitoring endpoint
const MONITOR_ENDPOINT = '/monitor';

// Create an Express application
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Function to measure network latency to a given URL
async function measureLatency(url: string): Promise<number> {
  try {
    // Start the timer
    const startTime = Date.now();

    // Make an HTTP GET request to the URL
    await axios.get(url);

    // Calculate the latency by measuring the time taken for the request to complete
    const latency = Date.now() - startTime;
    return latency;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error measuring latency:', error);
    throw error;
  }
}

// Endpoint to handle latency monitoring requests
app.post(MONITOR_ENDPOINT, async (req, res) => {
  try {
    // Extract the URL to monitor from the request body
    const { url } = req.body;

    // Check if the URL is provided and is a string
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: 'Invalid URL provided'
      });
    }

    // Measure the latency to the provided URL
    const latency = await measureLatency(url);

    // Return the latency result in the response
    res.json({
      latency,
      timestamp: Date.now()
    });
  } catch (error) {
    // Handle any errors that occur during latency measurement
    res.status(500).json({
      error: 'Failed to measure latency'
    });
  }
});

// Start the Express server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Network Latency Monitor is running on port ${PORT}`);
});