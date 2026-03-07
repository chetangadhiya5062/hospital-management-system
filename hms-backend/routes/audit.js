const express = require("express");
const router = express.Router();

const AuditLog = require("../models/AuditLog");
const authMiddleware = require("../middleware/authMiddleware");

// Admin only
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const logs = await AuditLog.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(logs);
});

module.exports = router;