// backend/routes/auth.js
import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refreshToken);

// NEW – get current user (used by frontend on page load)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await import("../models/User.js").then(m => m.default)
      .findById(req.user.id)
      .select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;