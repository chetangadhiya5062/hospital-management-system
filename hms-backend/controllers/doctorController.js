const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const AppError = require("../utils/AppError");

// ================= GET DOCTOR APPOINTMENTS =================
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    // 1️⃣ Find doctor profile using logged-in user id
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new AppError("Doctor profile not found", 404));
    }

    // 2️⃣ Find appointments linked to doctor._id
    const appointments = await Appointment.find({
      doctor: doctor._id
    })
      .populate("patient", "name email")
      .sort({ date: 1 });

    res.json({
      status: "success",
      data: appointments
    });

  } catch (error) {
    next(error);
  }
};

// ================= APPROVE =================
exports.approveAppointment = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new AppError("Doctor profile not found", 404));
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: doctor._id
    });

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    appointment.status = "approved";
    await appointment.save();

    res.json({
      status: "success",
      data: appointment
    });

  } catch (error) {
    next(error);
  }
};

// ================= REJECT =================
exports.rejectAppointment = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new AppError("Doctor profile not found", 404));
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      doctor: doctor._id
    });

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    appointment.status = "rejected";
    await appointment.save();

    res.json({
      status: "success",
      data: appointment
    });

  } catch (error) {
    next(error);
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new AppError("Doctor profile not found", 404));
    }

    res.json({
      status: "success",
      data: doctor,
    });

  } catch (error) {
    next(error);
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return next(new AppError("Doctor profile not found", 404));
    }

    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.bio = req.body.bio || doctor.bio;
    doctor.photo = req.body.photo || doctor.photo;

    await doctor.save();

    res.json({
      status: "success",
      data: doctor,
    });

  } catch (error) {
    next(error);
  }
};