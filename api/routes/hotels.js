import express from "express";
import {
    countByCity, countByType, createHotel, deleteHotel,
    getHotel, getHotelRooms, getHotels, updateHotel
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verifyToken.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.post("/", verifyAdmin, upload.array("photos", 5), createHotel);
router.put("/:id", verifyAdmin, upload.array("photos", 5), updateHotel);
router.delete("/:id", verifyAdmin, deleteHotel);
router.get("/find/:id", getHotel);
router.get("/", getHotels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

export default router;
