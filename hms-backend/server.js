require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const logger = require("./utils/logger");

const appointmentRoutes = require("./routes/appointment");
const doctorsRoutes = require("./routes/doctors");
const doctorRoutes = require("./routes/doctor");
const authRoutes = require("./routes/auth");
const auditRoutes = require("./routes/audit");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/upload");
const paymentRoutes = require("./routes/payment");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

/* ================= TRUST PROXY ================= */
app.set("trust proxy", 1);

/* ================= CORS ================= */

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* ================= SECURITY HEADERS ================= */

app.use(helmet());
app.use(hpp()); // optional but recommended

/* ================= RATE LIMIT (Auth Only) ================= */

const authLimiter = rateLimit({
  max: 20,
  windowMs: 15 * 60 * 1000,
  message: {
    status: "fail",
    message: "Too many authentication attempts. Try again later.",
  },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

/* ================= BODY + COOKIES ================= */

app.use(express.json());
app.use(cookieParser());

/* ================= REQUEST LOGGER ================= */

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

/* ================= DATABASE CONNECTION ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("✅ MongoDB Connected"))
  .catch((err) => {
    logger.error("❌ MongoDB Connection Failed");
    logger.error(err);
    process.exit(1);
  });

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/payments", paymentRoutes);

/* ================= ROOT ROUTE ================= */

app.get("/", (req, res) => {
  res.send("HMS Backend Running 🚀");
});

/* ================= DEV SEED ROUTE ================= */

if (process.env.NODE_ENV !== "production") {
  const Doctor = require("./models/Doctor");

  app.get("/seed-doctors", async (req, res, next) => {
    try {
      await Doctor.deleteMany();

      await Doctor.insertMany([
        { name: "Dr. Sharma", specialization: "Cardiologist" },
        { name: "Dr. Patel", specialization: "Dermatologist" },
        { name: "Dr. Mehta", specialization: "Neurologist" },
      ]);

      res.send("Doctors seeded");
    } catch (error) {
      next(error);
    }
  });
}

/* ================= GLOBAL ERROR HANDLER ================= */

app.use(errorMiddleware);

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

/* ================= GRACEFUL SHUTDOWN ================= */

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION 💥");
  logger.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION 💥");
  logger.error(err);

  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(1);
    });
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info("Server closed. Mongo disconnected.");
      process.exit(0);
    });
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info("Server closed. Mongo disconnected.");
      process.exit(0);
    });
  });
});