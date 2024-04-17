// ../models/Itenary.js
import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({

  city: String,
  attractions: [String],
  activities: [String],
  hotels: [String],
});

export const Itinerary = mongoose.model('Itinerary', itinerarySchema);