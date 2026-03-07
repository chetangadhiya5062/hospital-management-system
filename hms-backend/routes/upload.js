const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const Upload = require("../models/Upload");

router.post("/", authMiddleware, upload.single("file"), async (req, res, next) => {
  try {
    const newUpload = await Upload.create({
      user: req.user.id,
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
    });

    res.status(201).json({
      status: "success",
      data: newUpload,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      status: "success",
      data: uploads,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;