export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (err, req, res, next) => {
  console.log(err);

  res
    .status(err.status || 500)
    .json({ msg: err.msg || "something went wrong", error: err.message });
};
