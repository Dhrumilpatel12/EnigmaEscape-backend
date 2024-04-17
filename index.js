import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import destinationRoute from './routes/destination.js';
import city from './routes/city.js';
import Country from './routes/country.js';
import authRoutes from './routes/auth.js';
import state from './routes/state.js';
import userRoutes from "./routes/user.js";
import HotelRoutes from "./routes/Hotel.js";
import attractionRoutes from "./routes/Attraction.js";
import ActivityRoutes from "./routes/Activities.js";
import itineraryRouter from './routes/itinerary.js';


dotenv.config();
const app = express();
// const cors = require('cors');
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173','https://enigma-escape-frontend.vercel.app/'],
    methods: ["GET", "POST","PUT","DELETE"],
  }));
  
// Database connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB database connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

const port = process.env.PORT || 1234;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/destination', destinationRoute);
app.use('/attraction', attractionRoutes);
app.use('/Hotels', HotelRoutes);
app.use('/itinerary', itineraryRouter);
app.use('/Activity', ActivityRoutes);
app.use('/auth', authRoutes);
app.use('/city', city);
app.use('/user', userRoutes);
app.use('/country', Country);
app.use('/state', state);

app.listen(port, () => {
    connect();
    console.log('Server listening on port', port);
});
