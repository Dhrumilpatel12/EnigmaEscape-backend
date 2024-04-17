// models/Activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
        city: { type: String, required: true },
        name: { type: String, required: true },
        formatted_address: { type: String },
        geometry: {
            location: {
                lat: { type: Number },
                lng: { type: Number }
            }
        },
        opening_hours: {
            open_now: { type: Boolean },
            periods: [{ close: { day: Number, time: String }, open: { day: Number, time: String } }],
            weekday_text: [{ type: String }]
        },
        price_level: { type: Number },
        rating: { type: Number },
        photos: [{ type: String }],
        types: [{ type: String }],
        user_ratings_total: { type: Number }
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
