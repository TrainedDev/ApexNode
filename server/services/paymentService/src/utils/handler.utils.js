export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const globalError = (err, req, res, next) => {
  console.log(err);

  res.status(err.status || 500).json({ error: err.message });
};
