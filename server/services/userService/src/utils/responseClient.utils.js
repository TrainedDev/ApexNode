export const responseClient = (res, status, data) => {
    res.status(status || 200).json(data);
}