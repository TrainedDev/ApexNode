export const appError = (msg, statusCode) => {
  const error = new Error(msg);
  error.status = statusCode;

  throw error;
};
