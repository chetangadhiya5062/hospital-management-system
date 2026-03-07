const AuditLog = require("../models/AuditLog");
const logger = require("../utils/logger");

exports.logAction = async ({ userId, action, metadata, ip, userAgent }) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      metadata,
      ip,
      userAgent,
    });
  } catch (error) {
    logger.error("Audit log failed:");
    logger.error(error);
  }
};