const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const payment = await Payment.create({
      user: req.user.id,
      appointment: req.body.appointmentId,
      amount: req.body.amount,
    });

    res.status(201).json({
      status: "success",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate("appointment");

    res.json({
      status: "success",
      data: payments,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;