const appointmentService = require("../services/appointmentService");
const Appointment = require("../models/Appointment");
const AppError = require("../utils/AppError");
const auditService = require("../services/auditService");

/* ================= CREATE ================= */
exports.create = async (req, res, next) => {
  try {
    const appointment = await appointmentService.createAppointment(
      req.user,
      req.body
    );

    // Audit (non-blocking)
    try {
      await auditService.logAction({
        userId: req.user?.id,
        action: "APPOINTMENT_CREATED",
        metadata: {
          appointmentId: appointment._id,
          doctor: appointment.doctor,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          newStatus: appointment.status,
        },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    res.status(201).json({
      status: "success",
      data: appointment,
    });

  } catch (error) {
    next(error);
  }
};

/* ================= GET ================= */
exports.getAll = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAppointments(req.user);

    res.json({
      status: "success",
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= CANCEL ================= */
exports.cancel = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    // Ownership check
    if (req.user.role !== "admin") {
      if (appointment.patient.toString() !== req.user.id) {
        return next(
          new AppError("You can only cancel your own appointment", 403)
        );
      }
    }

    // Time restriction (5 min)
    const now = new Date();
    const appointmentDateTime = new Date(
      appointment.date.toISOString().split("T")[0] +
        " " +
        appointment.timeSlot
    );

    const diffInMinutes = (appointmentDateTime - now) / (1000 * 60);

    if (diffInMinutes < 5 && req.user.role !== "admin") {
      return next(
        new AppError(
          "Cannot cancel appointment within 5 minutes of scheduled time",
          400
        )
      );
    }

    const previousStatus = appointment.status;

    appointment.status = "cancelled";
    await appointment.save();

    // Audit after success
    try {
      await auditService.logAction({
        userId: req.user?.id,
        action: "APPOINTMENT_CANCELLED",
        metadata: {
          appointmentId: appointment._id,
          previousStatus,
          newStatus: appointment.status,
        },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    res.json({
      status: "success",
      message: "Appointment cancelled",
    });

  } catch (error) {
    next(error);
  }
};

/* ================= APPROVE ================= */
exports.approve = async (req, res, next) => {
  try {
    const appointment = await appointmentService.approveAppointment(
      req.params.id
    );

    // Audit after success
    try {
      await auditService.logAction({
        userId: req.user?.id,
        action: "APPOINTMENT_APPROVED",
        metadata: {
          appointmentId: appointment._id,
          previousStatus: "pending",
          newStatus: appointment.status,
        },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    res.json({
      status: "success",
      data: appointment,
    });

  } catch (error) {
    next(error);
  }
};

/* ================= REJECT ================= */
exports.reject = async (req, res, next) => {
  try {
    const appointment = await appointmentService.rejectAppointment(
      req.params.id
    );

    // Audit after success
    try {
      await auditService.logAction({
        userId: req.user?.id,
        action: "APPOINTMENT_REJECTED",
        metadata: {
          appointmentId: appointment._id,
          previousStatus: "pending",
          newStatus: appointment.status,
        },
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } catch (auditError) {
      console.error("Audit log failed:", auditError);
    }

    res.json({
      status: "success",
      data: appointment,
    });

  } catch (error) {
    next(error);
  }
};

/* ================= SLOTS ================= */
exports.slots = async (req, res, next) => {
  try {
    const slots = await appointmentService.getBookedSlots(
      req.query.doctor,
      req.query.date
    );

    res.json({
      status: "success",
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};