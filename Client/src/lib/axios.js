import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(config => {
    return config;
});

axiosInstance.interceptors.response.use(response => {
    return response.data;
}, err => {
    throw err;
})