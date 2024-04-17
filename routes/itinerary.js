// itinerary.js

import express from 'express';
import Attraction from '../models/Attraction.js';
import Hotel from '../models/Hotel.js';
import Activity from '../models/Activities.js';
import {  createItenary} from '../controllers/Itenary.js';
import { Itinerary } from '../models/Itenary.js';
const itineraryRouter = express.Router();

// Route to fetch attractions for a specific city
itineraryRouter.get('/attractions', async (req, res) => {
    const { city } = req.query;
    try {
        const attractions = await Attraction.find({ city });
        console.log('attractions',attractions);
        res.status(200).json(attractions);
    } catch (error) {
        console.error('Error fetching attractions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch hotels for a specific city
itineraryRouter.get('/hotels', async (req, res) => {
    const { city } = req.query;
    try {
        const hotels = await Hotel.find({ city });
        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
itineraryRouter.get('/', async (req, res) => {
    try {
      const itineraries = await Itinerary.find();
      res.status(200).json(itineraries);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
itineraryRouter.post('/', createItenary);
// Route to fetch activities for a specific city
itineraryRouter.get('/activities', async (req, res) => {
    const { city } = req.query;
    try {
        const activities = await Activity.find({ city });
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
itineraryRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { city, attractions, activities, hotels } = req.body;
  
    try {
      const updatedItinerary = await Itinerary.findByIdAndUpdate(
        id,
        { city, attractions, activities, hotels },
        { new: true }
      );
  
      if (!updatedItinerary) {
        return res.status(404).json({ error: 'Itinerary not found' });
      }
  
      res.status(200).json(updatedItinerary);
    } catch (error) {
      console.error('Error updating itinerary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Route to delete an itinerary by ID
  itineraryRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedItinerary = await Itinerary.findByIdAndDelete(id);
      if (!deletedItinerary) {
        return res.status(404).json({ error: 'Itinerary not found' });
      }
      res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
export default itineraryRouter;
