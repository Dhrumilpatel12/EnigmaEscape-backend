// backend/routes/cities.js

import express from 'express';
import fs from 'fs';

const router = express.Router();

// Route to get cities data
router.get('/', (req, res) => {
  // Read the cities.json file
  fs.readFile('./Data/countries.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading cities.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Parse the JSON data
    const cities = JSON.parse(data);

    // Send the cities data as the response
    res.json(cities);
  });
});

export default router;
