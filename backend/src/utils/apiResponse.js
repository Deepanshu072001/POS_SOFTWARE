export class ApiResponse {
  static success(
    res,
    message,
    data = {},
    statusCode = 200,
    requestId = null
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res,
    message,
    errors = [],
    statusCode = 500,
    requestId = null
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      requestId,
      timestamp: new Date().toISOString(),
    });
  }
}