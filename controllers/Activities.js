import axios from "axios";
import Activity from '../models/Activities.js';

export const getAllActivities = async (req, res, next) => {
    try {
        const googleApiKey = 'AIzaSyAOo1wTQp54U8W0FJWtB8JAnz_l51eQxso';
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

        let savedActivitiesCount = 0;
        let uniqueActivitiesCount = 0;

        // Fetch activities for each city
        const activitiesPromises = ontarioCities.map(async (city) => {
            // Perform the Axios request to search for popular activities in the current city
            const googleResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=popular+activities+in+${city}+Ontario&radius=500&type=point_of_interest&key=${googleApiKey}`);

            // Check if the response contains results
            if (googleResponse.data && googleResponse.data.results) {
                // Save each unique activity into the database
                const savedActivities = await Promise.all(googleResponse.data.results.map(async (activityData) => {
                    // Check if the activity already exists in the database
                    const existingActivity = await Activity.findOne({ name: activityData.name, city: city });

                    if (!existingActivity) {
                        // Convert photos array to array of photo references
                        const photoReferences = activityData.photos ? activityData.photos.map(photo => photo.photo_reference) : [];

                        // Create a new activity object using the fetched data
                        const newActivity = new Activity({
                            city: city,
                            name: activityData.name,
                            formatted_address: activityData.formatted_address,
                            geometry: activityData.geometry,
                            opening_hours: activityData.opening_hours,
                            price_level: activityData.price_level,
                            rating: activityData.rating,
                            photos: photoReferences, // Store only photo references
                            types: activityData.types,
                            user_ratings_total: activityData.user_ratings_total
                        });

                        // Save the activity into the database
                        await newActivity.save();
                        savedActivitiesCount++;
                    } else {
                        uniqueActivitiesCount++;
                    }
                }));
                return savedActivities;
            } else {
                // No results found for this city
                return [];
            }
        });

        // Wait for all activities to be fetched and saved
        await Promise.all(activitiesPromises.flat());

        // Respond with the count and data of saved activities
        res.status(200).json({ success: true, savedActivitiesCount, uniqueActivitiesCount, message: 'Activities saved successfully' });
    } catch (err) {
        console.error('Error fetching popular activities:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
export const deleteActivitesById = async (req, res,next) => {
    try {
        const { id } = req.params;
        console.log('Activity ID:####', id); // Log the hotel ID
        
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ success: false, message: 'Invalid ID format' });
        // }
        console.log("%%%%%%%%%%%%");
        
        const deletedActivity = await Activity.findByIdAndDelete(id);
        if (!deletedActivity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }
        res.json({ success: true, message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting Activity:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};