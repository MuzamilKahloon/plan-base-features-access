// backend/controllers/paymentController.js
import stripe from "stripe";
import User from "../models/User.js";
import Plan from "../models/Plan.js";

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }
  return stripe(process.env.STRIPE_SECRET_KEY);
};

// ──────────────────────────────────────────────────────────────
// 1. CREATE CHECKOUT SESSION
// ──────────────────────────────────────────────────────────────
export const createCheckoutSession = async (req, res) => {
  try {
    const stripeClient = getStripeClient();
    const { planType } = req.body;
    const userId = req.user?.id;

    const validPlans = ["basic", "normal", "pro"];
    if (!validPlans.includes(planType)) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const productIds = {
      basic: process.env.STRIPE_BASIC_PRODUCT_ID,
      normal: process.env.STRIPE_NORMAL_PRODUCT_ID,
      pro: process.env.STRIPE_PRO_PRODUCT_ID,
    };
    const productId = productIds[planType];
    if (!productId) {
      return res.status(500).json({ message: `Missing STRIPE_${planType.toUpperCase()}_PRODUCT_ID` });
    }

    const priceVar = `${planType.toUpperCase()}_PRICE`;
    const price = parseInt(process.env[priceVar], 10);
    if (!price || price <= 0) {
      return res.status(500).json({ message: `Invalid ${priceVar}` });
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product: productId,
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin || "http://localhost:5173"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || "http://localhost:5173"}/payment/cancel`,
      metadata: { userId: userId.toString(), planType },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err.message);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

// ──────────────────────────────────────────────────────────────
// 2. HANDLE PAYMENT SUCCESS (UPDATED: RETURN currentPlan & planExpiry)
// ──────────────────────────────────────────────────────────────
export const handlePaymentSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    const userId = req.user?.id;

    if (!session_id) return res.status(400).json({ message: "Missing session_id" });
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const stripeClient = getStripeClient();
    const session = await stripeClient.checkout.sessions.retrieve(session_id);
    const { planType } = session.metadata;

    if (!planType || !["basic", "normal", "pro"].includes(planType)) {
      return res.status(400).json({ message: "Invalid plan in session" });
    }
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }
    if (session.metadata.userId !== userId.toString()) {
      return res.status(403).json({ message: "Payment does not belong to user" });
    }

    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { currentPlan: planType, planExpiry: expiryDate },
      { new: true }
    );

    await Plan.create({
      userId,
      planType,
      startDate: new Date(),
      endDate: expiryDate,
      status: "active",
      stripeSessionId: session.id,
    });

    // THIS WAS MISSING → DASHBOARD SHOWS BLANK
    res.json({
      message: "Payment successful!",
      currentPlan: planType,
      planExpiry: expiryDate,
    });
  } catch (err) {
    console.error("handlePaymentSuccess error:", err.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// ──────────────────────────────────────────────────────────────
// 3. GET USER PLAN
// ──────────────────────────────────────────────────────────────
export const getUserPlan = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("currentPlan planExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    let isExpired = false;
    if (user.currentPlan === "free" && user.planExpiry && user.planExpiry < new Date()) {
      await User.findByIdAndUpdate(userId, { planExpiry: null });
      user.planExpiry = null;
      isExpired = true;
    }

    res.json({
      currentPlan: user.currentPlan,
      planExpiry: user.planExpiry,
      isExpired,
    });
  } catch (err) {
    console.error("getUserPlan error:", err.message);
    res.status(500).json({ message: "Failed to fetch plan" });
  }
};