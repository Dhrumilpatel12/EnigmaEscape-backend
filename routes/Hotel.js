import express from "express";
import {  getAllHotels,deleteHotelById } from "../controllers/Hotel.js";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// router.post("/", createDestination);

// router.put("/:id", updateDestination);

// router.delete("/:id", deleteDestination);

// router.get("/:id", getSingleDestination);

// router.get("/", getAllDestinations);

router.get("/address/:id", getAllHotels); //address

router.delete("/:id", deleteHotelById);



router.get('/', async (req, res) => {
    try {
        console.log('Fetching all hotels');
        const hotels = await Hotel.find();

        // You can perform any additional processing here if needed
        
        res.json({ success: true, data: hotels });
    } catch (err) {
        console.error('Error fetching hotels:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
// Assuming you have imported the Hotel model

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedHotelData = req.body; // Assuming you're sending updated data in the request body

        // Update the hotel using the provided ID
        const updatedHotel = await Hotel.findByIdAndUpdate(id, updatedHotelData, { new: true });

        res.json({ success: true, data: updatedHotel });
    } catch (error) {
        console.error('Error editing hotel:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
router.get('/hotels/cities', async (req, res) => {
    try {
        const cities = await Hotel.distinct('city');
        res.status(200).json(cities);
    } catch (error) {
        console.error('Error fetching hotel cities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/hotels', async (req, res) => {
    try {
        const { city } = req.query;
        const hotels = await Hotel.find({ city });
        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// router.delete("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check if id is missing or invalid
//         if (!id || typeof id !== 'string') {
//             return res.status(400).json({ success: false, message: 'Invalid or missing ID parameter' });
//         }

//         // Delete the hotel using the provided ID
//         await Hotel.findByIdAndDelete(id);

//         res.json({ success: true, message: 'Hotel deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting hotel:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });


router.get('/hotelss/:id', async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        // Decrypt the photo URLs if necessary
        const decryptedPhotos = hotel.photos.map((photo) => decryptUrl(photo));

        const hotelDetails = {
            id: hotel._id,
            name: hotel.name,
            photos: decryptedPhotos,
            rating: hotel.rating,
            formatted_address: hotel.formatted_address,
            user_ratings_total: hotel.user_ratings_total,
            // Include any additional fields you want to expose
        };

        res.status(200).json(hotelDetails);
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  const decryptUrl = (encryptedUrl) => {
    // Your decryption logic here
    // This is just a placeholder, replace it with your actual decryption logic
    return encryptedUrl.replace('encrypted_string', 'decrypted_string');
};
export default router;
