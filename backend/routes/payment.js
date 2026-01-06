import express from "express";
import { createOrder, verifyPayment, createDonationOrder, verifyDonation, getDonationStats } from "../controllers/paymentController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-order", authenticate, createOrder);
router.post("/verify", authenticate, verifyPayment);
router.post("/donate", createDonationOrder);
router.post("/verify-donation", verifyDonation);
router.get("/donation-stats", getDonationStats);

export default router;