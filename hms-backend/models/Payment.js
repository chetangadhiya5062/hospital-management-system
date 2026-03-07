const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    amount: Number,
    status: {
      type: String,
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);