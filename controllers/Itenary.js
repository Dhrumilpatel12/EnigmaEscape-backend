import { Itinerary } from '../models/Itenary.js';
import axios from "axios";

export const createItenary = async (req, res) => {
try {
    const { city, attractions, activities, hotels } = req.body;

    // Create a new itinerary document
    const newItinerary = new Itinerary({
      city,
      attractions,
      activities,
      hotels,
    });

    // Save the itinerary to the database
    const savedItinerary = await newItinerary.save();

    res.status(201).json(savedItinerary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
