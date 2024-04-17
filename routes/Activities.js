import express from 'express';
import {  getAllActivities,deleteActivitesById } from "../controllers/Activities.js";
import Activity from '../models/Activities.js';
const router = express.Router();


router.get("/address/:id", getAllActivities); //address
router.get('/', async (req, res) => {
    try {
        // Find all activities in the database
        const activities = await Activity.find();
        res.json({ success: true, data: activities });
    } catch (err) {
        console.error('Error fetching activities:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
// Modify Activities.js
router.get('/cities', async (req, res) => {
    try {
        const activities = await Activity.find();
        const cityNames = activities.map(activity => activity.city);
        console.log('cityNames',cityNames);
        const uniqueCityNames = [...new Set(cityNames)]; // Remove duplicates
        res.status(200).json(uniqueCityNames);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/ratings', async (req, res) => {
    try {
      const activities = await Activity.find();
      const ratings = activities.map(activity => activity.rating);
      const uniqueRatings = [...new Set(ratings)]; // Remove duplicates
      res.status(200).json(uniqueRatings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.delete("/:id", deleteActivitesById);
// DELETE activity by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         // Find and delete the activity by ID
//         await Activity.findByIdAndDelete(id);
//         res.json({ success: true, message: 'Activity deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting activity:', err);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

router.get('/activitys/:id', async (req, res) => {
    try {
      const activityId = req.params.id;
      const activity = await Activity.findById(activityId);
  
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
  
      // Decrypt the photo URLs if necessary
      const decryptedPhotos = activity.photos.map((photo) => decryptUrl(photo));
  
      const activityDetails = {
        id: activity._id,
        name: activity.name,
        photos: decryptedPhotos,
        rating: activity.rating,
        formatted_address: activity.formatted_address,
        user_ratings_total: activity.user_ratings_total,
      };
  
      res.status(200).json(activityDetails);
    } catch (error) {
      console.error('Error fetching activity details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  const decryptUrl = (encryptedUrl) => {
    // Your decryption logic here
    // This is just a placeholder, replace it with your actual decryption logic
    return encryptedUrl.replace('encrypted_string', 'decrypted_string');
};
  
export default router