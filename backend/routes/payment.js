// backend/routes/payment.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createCheckoutSession,
  handlePaymentSuccess,
  getUserPlan,
} from "../controllers/paymentController.js";

const router = express.Router();

// All routes require a valid JWT (verifyToken middleware)
router.post("/create-checkout-session", verifyToken, createCheckoutSession);
router.get("/success", verifyToken, handlePaymentSuccess);
router.get("/plan", verifyToken, getUserPlan);

export default router;