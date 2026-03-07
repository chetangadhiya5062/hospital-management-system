const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  photo: {
    type: String, // store image URL
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);