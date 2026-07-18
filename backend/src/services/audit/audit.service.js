import { AuditLog } from "../../models/index.js";

class AuditService {
  async log({
    user,
    module,
    action,
    description,
    ipAddress = "",
    userAgent = "",
  }) {
    return AuditLog.create({
      user,
      module,
      action,
      description,
      ipAddress,
      userAgent,
    });
  }
}

export default new AuditService();