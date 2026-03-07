const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: String,
    originalname: String,
    path: String,
    size: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);