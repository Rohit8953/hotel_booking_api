import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (Ensure these values are set in your environment variables)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// CREATE HOTEL
export const createHotel = async (req, res, next) => {
    try {
        const imageUrls = [];

        // Upload each file to Cloudinary
        if (req.files) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "hotels", // Optional: store images in a specific folder
                    use_filename: true,
                    unique_filename: false,
                });
                imageUrls.push(result.secure_url);
            }
        }

        // Save hotel with uploaded image URLs
        const newHotel = new Hotel({ ...req.body, photos: imageUrls });
        const savedHotel = await newHotel.save();

        res.status(200).json(savedHotel);
    } catch (err) {
        next(err);
    }
};


// UPDATE HOTEL
export const updateHotel = async (req, res, next) => {
    try {
        let imageUrls = req.body.photos;
        if (req.files) {
            imageUrls = req.files.map(file => file.path);
        }
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: { ...req.body, photos: imageUrls } },
            { new: true }
        );
        res.status(200).json(updatedHotel);
    } catch (err) {
        next(err);
    }
};

// DELETE HOTEL
export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("Hotel has been deleted.");
    } catch (err) {
        next(err);
    }
};

// GET SINGLE HOTEL
export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    } catch (err) {
        next(err);
    }
};

// GET ALL HOTELS
export const getHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

// COUNT BY CITY
export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");
    try {
        const list = await Promise.all(cities.map(city => Hotel.countDocuments({ city })));
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};

// COUNT BY TYPE
export const countByType = async (req, res, next) => {
    try {
        const types = ["hotel", "apartment", "resort", "villa", "cabin"];
        const counts = await Promise.all(types.map(type => Hotel.countDocuments({ type })));
        res.status(200).json(types.map((type, i) => ({ type, count: counts[i] })));
    } catch (err) {
        next(err);
    }
};

// GET HOTEL ROOMS
export const getHotelRooms = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        const rooms = await Promise.all(hotel.rooms.map(roomId => Room.findById(roomId)));
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
};
