import express from 'express';
import fs from 'fs';

const router = express.Router();

// Route to get cities data
router.get('/', (req, res) => {
  // Read the cities.json file
  fs.readFile('./Data/states.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading states.json:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    try {
      // Parse the JSON data
      const states = JSON.parse(data);
      // Send the states data as the response
      res.json(states);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ error: 'Error parsing JSON' });
    }
  });
});

export default router;
