const express = require("express");
const router = express.Router();
const restrictTo = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const appointmentController = require("../controllers/appointmentController");

// Create appointment
router.post("/", authMiddleware, appointmentController.create);

// Get appointments
router.get("/", authMiddleware, appointmentController.getAll);

// Cancel
router.put("/cancel/:id", authMiddleware, appointmentController.cancel);

// Approve and Reject (admin only)
router.put(
  "/approve/:id",
  authMiddleware,
  restrictTo("admin"),
  appointmentController.approve
);

router.put(
  "/reject/:id",
  authMiddleware,
  restrictTo("admin"),
  appointmentController.reject
);
// Get slots
router.get("/slots", authMiddleware, appointmentController.slots);

module.exports = router;