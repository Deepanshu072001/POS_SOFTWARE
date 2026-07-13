export const successResponse = (
  message,
  data = {},
  requestId = null
) => {
  return {
    success: true,
    message,
    data,
    requestId,
  };
};

export const errorResponse = (
  message,
  errors = [],
  requestId = null
) => {
  return {
    success: false,
    message,
    errors,
    requestId,
  };
};