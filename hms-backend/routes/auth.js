const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

//VALIDATE
const validate = require("../middleware/validationMiddleware");
const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidation");

// REGISTER
router.post("/register", registerValidation, validate, authController.register);

// LOGIN
router.post("/login", loginValidation, validate, authController.login);

// PROFILE
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

// LOGOUT
router.post("/logout", authController.logout);

// AUTO LOGIN CHECK
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role,
  });
});

// REFRESH TOKEN 
router.post("/refresh", authController.refreshToken);

module.exports = router;