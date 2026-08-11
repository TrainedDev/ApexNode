export const responseUser = (res, statusCode, data) => {
    res.status(statusCode || 200).json(data);
};