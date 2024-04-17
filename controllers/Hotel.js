// Import required modules and models
import axios from "axios";
import Hotel from '../models/Hotel.js';
import mongoose from 'mongoose';
export const getAllHotels = async (req, res, next) => {
    try {
        // List of Ontario cities
        const ontarioCities = [
            "Toronto",
            "Ottawa",
            "Hamilton",
            "Windsor",
            "St. Catharines",
            "Greater Sudbury",
            "Mississauga",
            "Peterborough",
            "Kitchener",
            "Kingston",
            "North Bay",
            "Vaughan",
            "Burlington",
            "Guelph",
            "Barrie",
            "Brampton",
            "Thunder Bay",
            "Oshawa",
            "Cambridge",
            "Elliot Lake",
            "Brantford",
            "Richmond Hill",
            "Sault Ste. Marie",
            "Stratford",
            "Timmins",
            "Sarnia",
            "Owen Sound",
            "Brockville",
            "Kenora",
            "London",
            "Chatham-Kent",
            "Temiskaming Shores",
            "Kawartha Lakes",
            "Waterloo",
            "Brant",
            "Markham",
            "Niagara Falls",
            "Thorold",
            "Woodstock",
            "Leamington",
            "Port Colborne",
            "Belleville",
            "Cornwall",
            "Welland",
            "Orillia",
            "St. Thomas",
            "Pickering",
            "Quinte West",
            "Pembroke",
            "Clarence-Rockland",
            "Oakville"
        ];

        // Array to store all hotels
        let allHotels = [];

        // Fetch hotels for each city
        for (const city of ontarioCities) {
            // Fetch hotels for the current city
            const googleApiKey = 'AIzaSyAOo1wTQp54U8W0FJWtB8JAnz_l51eQxso';
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${city}&key=${googleApiKey}`);

            // Check if response.data.results exists
            if (response.data.results) {
                // Map fetched hotels to Hotel model fields
                const hotels = response.data.results.map(result => ({
                    city: city,
                    name: result.name,
                    rating: result.rating || 0,
                    photos: result.photos ? result.photos.map(photo => photo.photo_reference) : [], // Extract photo references from photos array
                    imageUrl: result.photos && result.photos.length > 0 ? result.photos[0].photo_reference : 'default-image-url', // Provide a default image URL
                    coordinates: {
                        lat: result.geometry.location.lat,
                        lng: result.geometry.location.lng
                    },
                    formatted_address: result.formatted_address,
                    business_status: result.business_status,
                    opening_hours: result.opening_hours ? result.opening_hours : { open_now: false },
                    user_ratings_total: result.user_ratings_total,
                    types: result.types
                }));

                // Add fetched hotels to the array
                allHotels = [...allHotels, ...hotels];
            }
        }

        // Check if any hotels were fetched
        if (allHotels.length === 0) {
            return res.status(404).json({ success: false, message: 'No hotels found' });
        }
        console.log('Retrieved hotels:', allHotels);
        // Check if hotels already exist in the database
        const existingHotels = await Hotel.find({
            $or: allHotels.map(hotel => ({
                name: hotel.name,
                'coordinates.lat': hotel.coordinates.lat,
                'coordinates.lng': hotel.coordinates.lng
            }))
        });

        // Filter out hotels that already exist
        const newHotels = allHotels.filter(hotel => {
            return !existingHotels.some(existingHotel =>
                existingHotel.name === hotel.name &&
                existingHotel.coordinates.lat === hotel.coordinates.lat &&
                existingHotel.coordinates.lng === hotel.coordinates.lng
            );
        });

        // Save only new unique hotels to the database
        if (newHotels.length > 0) {
            const savedHotels = await Hotel.insertMany(newHotels);
            res.status(200).json({ success: true, message: 'Hotels saved successfully', data: savedHotels });
        } else {
            res.status(200).json({ success: true, message: 'No new hotels to save' });
        }
    } catch (error) {
        console.error('Error fetching or saving hotels:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const deleteHotelById = async (req, res,next) => {
    try {
        const { id } = req.params;
        console.log('Hotel ID:####', id); // Log the hotel ID
        
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ success: false, message: 'Invalid ID format' });
        // }
        console.log("%%%%%%%%%%%%");
        
        const deletedHotel = await Hotel.findByIdAndDelete(id);
        if (!deletedHotel) {
            return res.status(404).json({ success: false, message: 'Hotel not found' });
        }
        res.json({ success: true, message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error('Error deleting hotel:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


