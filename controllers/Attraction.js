import axios from "axios";
import Attraction from '../models/Attraction.js';

export const getAllAddresses = async (req, res, next) => {
    const googleApiKey = 'AIzaSyAOo1wTQp54U8W0FJWtB8JAnz_l51eQxso'; // Replace with your actual API key

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

        // Array to store all attractions
        let allAttractions = [];

        for (const city of ontarioCities) {
            const googleResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=famous+attractions+in+${city},+Ontario&key=${googleApiKey}`);

            // Map fetched data to Attraction model fields
            const attractions = googleResponse.data.results.map(result => {
                return {
                    city: city,
                    name: result.name,
                    rating: result.rating || 0, // Default to 0 if rating is not provided
                    photos: result.photos ? result.photos.map(photo => photo.photo_reference) : [], // Extract photo references from photos array
                    imageUrl: result.photos && result.photos.length > 0 ? result.photos[0].photo_reference : '', // Assuming you want to store the first photo's reference
                    coordinates: {
                        lat: result.geometry.location.lat,
                        lng: result.geometry.location.lng
                    },
                    formatted_address: result.formatted_address,
                    business_status: result.business_status,
                    opening_hours: result.opening_hours,
                    user_ratings_total: result.user_ratings_total,
                    types: result.types
                };
            });

            allAttractions = [...allAttractions, ...attractions];
        }

        // Check if attractions already exist in the database
        const existingAttractions = await Attraction.find({ name: { $in: allAttractions.map(attraction => attraction.name) } });

        // Filter out attractions that already exist
        const newAttractions = allAttractions.filter(attraction => !existingAttractions.some(existingAttraction => existingAttraction.name === attraction.name));

        // Filter out attractions that don't have imageUrl
        const attractionsWithImageUrl = newAttractions.filter(attraction => attraction.imageUrl);

        // Save only new attractions with imageUrl to the database
        if (attractionsWithImageUrl.length > 0) {
            const savedAttractions = await Attraction.insertMany(attractionsWithImageUrl);

            // Send success response
            res.status(200).json({ success: true, message: 'Data saved successfully', data: savedAttractions });
        } else {
            res.status(200).json({ success: true, message: 'No new attractions with imageUrl to save' });
        }
    } catch (err) {
        console.error('Error fetching attractions:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
export const deleteAttrctionById = async (req, res,next) => {
    try {
        const { id } = req.params;
        console.log('Attrction ID:####', id); // Log the hotel ID
        
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ success: false, message: 'Invalid ID format' });
        // }
        console.log("%%%%%%%%%%%%");
        
        const deletedAttrction = await Attraction.findByIdAndDelete(id);
        if (!deletedAttrction) {
            return res.status(404).json({ success: false, message: 'Attrction not found' });
        }
        res.json({ success: true, message: 'Attrction deleted successfully' });
    } catch (error) {
        console.error('Error deleting Attrction:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
