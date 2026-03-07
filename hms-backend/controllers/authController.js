const authService = require("../services/authService");
const AppError = require("../utils/AppError");
const auditService = require("../services/auditService");

// Detect production environment
const isProduction = process.env.NODE_ENV === "production";

// Common cookie options
const accessTokenOptions = {
  httpOnly: true,
  secure: isProduction,       // true in production (HTTPS)
  sameSite: isProduction ? "strict" : "lax",         // better CSRF protection
  maxAge: 15 * 60 * 1000,     // 15 minutes
};

const refreshTokenOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ================= REGISTER =================
exports.register = async (req, res, next) => {
  try {
    // 1️⃣ Register the user
    const newUser = await authService.registerUser(req.body);

    // 2️⃣ Audit log (do NOT break registration if it fails)
    try {
      await auditService.logAction({
        userId: newUser?.id || null, // better than always null
        action: "USER_REGISTER",
        metadata: { email: req.body.email },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    // 3️⃣ Send response
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    next(error);
  }
};
// ================= LOGIN =================
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } =
      await authService.loginUser(req.body);

    // Set cookies
    res.cookie("token", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);
    
    await auditService.logAction({
      userId: user._id,
      action: "USER_LOGIN",
      metadata: { email: user.email },
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      role: user.role,
      accessToken,
    });
    
  } catch (error) {
    next(error);
  }
};

// ================= REFRESH =================
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(new AppError("No refresh token provided", 401));
    }

    const { accessToken, newRefreshToken } =
      await authService.refreshUser(refreshToken);

    // Set new tokens
    res.cookie("token", accessToken, accessTokenOptions);
    res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

    res.json({ message: "Token refreshed" });
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }

    // ✅ Audit log (safe wrapper)
    try {
      await auditService.logAction({
        userId: req.user?.id || null,
        action: "USER_LOGOUT",
        metadata: {},
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    // Clear cookies properly (must match options)
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });

    res.json({ message: "Logged out successfully" });

  } catch (error) {
    next(error);
  }
};