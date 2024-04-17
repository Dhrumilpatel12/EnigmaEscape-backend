import mongoose from 'mongoose';

    const hotelSchema = new mongoose.Schema({
        city: { type: String, required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        photos: { type: [String] }, // Add photos field if you want to store photos directly
        imageUrl: { type: String, required: true, default: 'default-image-url' },
        coordinates: { type: Object, required: true },
        formatted_address: { type: String },
        business_status: { type: String },
        opening_hours: { type: Object },
        user_ratings_total: { type: Number },
        types: { type: [String] },

    });

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
