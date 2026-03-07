const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

// Protect all admin routes (must be logged in)
router.use(authMiddleware);

// Extra protection: Only admin role allowed
router.use((req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
});

// ================= ADMIN ROUTES =================

// Dashboard stats
router.get("/stats", adminController.getStats);

// Create doctor (secure)
router.post("/create-doctor", adminController.createDoctor);

module.exports = router;