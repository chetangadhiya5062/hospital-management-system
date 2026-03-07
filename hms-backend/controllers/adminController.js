const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const AppError = require("../utils/AppError");

/* =====================================================
   CREATE DOCTOR (Admin Only)
===================================================== */
exports.createDoctor = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new AppError("Access denied", 403));
    }

    const { name, email, password, specialization } = req.body;

    if (!name || !email || !password || !specialization) {
      return next(new AppError("All fields are required", 400));
    }

    // Check if already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with doctor role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      user: user._id,
      name,
      specialization,
    });

    res.status(201).json({
      status: "success",
      message: "Doctor created successfully",
      data: {
        user,
        doctor,
      },
    });

  } catch (error) {
    next(error);
  }
};


/* =====================================================
   ADMIN DASHBOARD STATS
===================================================== */
exports.getStats = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return next(new AppError("Access denied", 403));
    }

    const [
      totalUsers,
      totalDoctors,
      totalAppointments,
      statusStats,
      last7Days,
      topDoctors
    ] = await Promise.all([

      User.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),

      // Status breakdown
      Appointment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Last 7 days
      Appointment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top doctors
      Appointment.aggregate([
        {
          $group: {
            _id: "$doctor",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "doctors",
            localField: "_id",
            foreignField: "_id",
            as: "doctorInfo",
          },
        },
        {
          $unwind: {
            path: "$doctorInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            doctorName: "$doctorInfo.name",
            specialization: "$doctorInfo.specialization",
            count: 1,
          },
        },
      ]),

    ]);

    res.json({
      status: "success",
      data: {
        totals: {
          totalUsers,
          totalDoctors,
          totalAppointments,
        },
        statusStats,
        last7Days,
        topDoctors,
      },
    });

  } catch (error) {
    next(error);
  }
};