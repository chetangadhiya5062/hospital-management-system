const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

// ================= PUBLIC VIEW DOCTOR =================
router.get("/public/:id", async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name"
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      status: "success",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
});

// Protect all doctor routes
router.use(authMiddleware);

// Only doctor role allowed
router.use((req, res, next) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
});

// ================= DOCTOR ROUTES =================

// View own appointments
router.get("/appointments", doctorController.getDoctorAppointments);

// Approve appointment
router.put("/approve/:id", doctorController.approveAppointment);

// Reject appointment
router.put("/reject/:id", doctorController.rejectAppointment);

router.get("/profile", doctorController.getProfile);
router.put("/profile", doctorController.updateProfile);

module.exports = router;