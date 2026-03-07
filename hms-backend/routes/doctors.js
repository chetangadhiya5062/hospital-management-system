const express = require("express");
const Doctor = require("../models/Doctor");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const doctors = await Doctor.find().select("name specialization");

    res.json({
      status: "success",
      data: doctors
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;