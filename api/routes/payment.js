import express from "express";
const router = express.Router();
import { makepayment } from "../controllers/makePayment.js";
router.post("/create-checkout-session", makepayment);
export default router