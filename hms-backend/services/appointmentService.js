const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const AppError = require("../utils/AppError");

// Create appointment
// Create appointment
exports.createAppointment = async (user, data) => {
  const { doctor, date, timeSlot, reason } = data;

  // ================= PAST DATE VALIDATION =================
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    throw new AppError("Cannot book appointment in the past", 400);
  }

  // ================= CHECK DOCTOR EXISTS =================
  const doctorExists = await Doctor.findById(doctor);
  if (!doctorExists) {
    throw new AppError("Doctor not found", 404);
  }

  // ================= SLOT DUPLICATION CHECK =================
  const existing = await Appointment.findOne({
    doctor,
    date,
    timeSlot,
    status: { $in: ["pending", "approved"] },
  });

  if (existing) {
    throw new AppError(
      "This time slot is already booked for the selected doctor",
      409
    );
  }

  // ================= OPTIONAL: LIMIT USER BOOKINGS PER DAY =================
  const userBookingsToday = await Appointment.countDocuments({
    patient: user.id,
    date,
    status: { $in: ["pending", "approved"] },
  });

  if (userBookingsToday >= 3) {
    throw new AppError(
      "You cannot book more than 3 appointments per day",
      400
    );
  }

  // ================= CREATE APPOINTMENT =================
  const appointment = await Appointment.create({
    patient: user.id,
    doctor,
    date,
    timeSlot,
    reason,
  });

  return appointment;
};

// Get appointments (User or Admin)
exports.getAppointments = async (user) => {
  if (user.role === "admin") {
    return await Appointment.find()
      .populate("doctor")
      .populate("patient");
  }

  return await Appointment.find({ patient: user.id }).populate("doctor");
};

// Cancel appointment
exports.cancelAppointment = async (appointmentId, user) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (user.role !== "admin" && appointment.patient.toString() !== user.id) {
    throw new AppError("Access denied", 403);
  }

  appointment.status = "cancelled";
  await appointment.save();

  return appointment;
};

// Approve appointment (Admin)
exports.approveAppointment = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  appointment.status = "approved";
  await appointment.save();

  return appointment;
};

// Reject appointment (Admin)
exports.rejectAppointment = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  appointment.status = "rejected";
  await appointment.save();

  return appointment;
};

// Get booked slots
exports.getBookedSlots = async (doctorId, date) => {
  const appointments = await Appointment.find({
    doctor: doctorId,
    date,
    status: { $in: ["pending", "approved"] },
  });

  return appointments.map((a) => a.timeSlot);
};