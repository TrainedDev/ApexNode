export const appError = (msg) => {
    const error = new Error(msg);
    throw error;
}