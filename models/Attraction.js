import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema({
    city: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    photos: { type: [String], required: true },
    imageUrl: { type: String, required: true },
    coordinates: { type: Object, required: true },
    formatted_address: { type: String },
    business_status: { type: String },
    opening_hours: { type: Object },
    user_ratings_total: { type: Number },
    types: { type: [String] },

});

const Attraction = mongoose.model('Attraction', attractionSchema);

export default Attraction;
