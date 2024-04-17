import express from 'express';
import {  getAllAddresses,deleteAttrctionById } from '../controllers/Attraction.js';

import Attraction from '../models/Attraction.js';
const router = express.Router();

console.log("in routes");
router.get("/address/:id", getAllAddresses); //address
// const decryptUrl = (encryptedUrl) => {
//     // Your decryption logic here
//     // This is just a placeholder, replace it with your actual decryption logic
//     return encryptedUrl.replace('encrypted_string', 'decrypted_string');
// };

router.delete("/:id", deleteAttrctionById);
// Modify Attraction.js
router.get('/attractions/cities', async (req, res) => {
    try {
        const cities = await Attraction.distinct('city');
        res.status(200).json(cities);
    } catch (error) {
        console.error('Error fetching attraction cities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/attractions', async (req, res) => {
    try {
        const { city } = req.query;
        const attractions = await Attraction.find({ city });
        res.status(200).json(attractions);
    } catch (error) {
        console.error('Error fetching attractions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/types', async (req, res) => {
    try {
        const types = await Attraction.distinct('types');
        console.log('types',types);
        res.status(200).json(types);
    } catch (error) {
        console.error('Error fetching types:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.put('/attraction/:id', async (req, res,next) => {
    try {
        const updatedAttraction = await Attraction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedAttraction);
    } catch (error) {
        console.error('Error updating attraction:', error);
        res.status(500).json({ message: 'Failed to update attraction' });
    }
});
const decryptUrl = (encryptedUrl) => {
    // Your decryption logic here
    // This is just a placeholder, replace it with your actual decryption logic
    return encryptedUrl.replace('encrypted_string', 'decrypted_string');
};

router.get('/', async (req, res) => {
    try {
        console.log('Fetching all data');
        const attractions = await Attraction.find();

        
        const attractionsWithDecryptedUrls = attractions.map(attraction => {
            let decryptedPhotos = [];
            if (Array.isArray(attraction.photos)) {
                decryptedPhotos = attraction.photos.map(photo => {
                    if (typeof photo === 'string') {
                        return decryptUrl(photo);
                    } else {
                        return photo; 
                    }
                });
            } else if (typeof attraction.photos === 'string') {
                decryptedPhotos = decryptUrl(attraction.photos);
            }

            return {
                ...attraction.toObject(),
                photos: decryptedPhotos
            };
        });

        res.json({ success: true, data: attractionsWithDecryptedUrls });
    } catch (err) {
        console.error('Error fetching attractions:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

 

// import express from 'express';
// import Attraction from '../models/Attraction.js';


router.get('/attractions/:id', async (req, res) => {
    try {
      const attractionId = req.params.id;
      const attraction = await Attraction.findById(attractionId);
  
      if (!attraction) {
        return res.status(404).json({ error: 'Attraction not found' });
      }
  
      // Decrypt the photo URLs if necessary
      const decryptedPhotos = attraction.photos.map((photo) => decryptUrl(photo));
  
      const attractionDetails = {
        id: attraction._id,
        name: attraction.name,
        photos: decryptedPhotos,
        rating: attraction.rating,
        formatted_address: attraction.formatted_address, 
        user_ratings_total: attraction.user_ratings_total,
      };
  
      res.status(200).json(attractionDetails);
    } catch (error) {
      console.error('Error fetching attraction details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// // Assuming you have a decryptUrl function to decrypt the photo URLs
// const decryptUrl = (encryptedUrl) => {
//   // Your decryption logic here
//   // This is just a placeholder, replace it with your actual decryption logic
//   return encryptedUrl.replace('encrypted_string', 'decrypted_string');
// };



export default router;
