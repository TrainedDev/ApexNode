import { axiosInstance } from "../../lib/axios";

export const loginService = async (data) => await axiosInstance.post("/user/login", data);

export const userAuthStatusService = async () => await axiosInstance.get("/user/status");

export const registerService = async (data) => await axiosInstance.post("/user/register", data);

export const logoutService = async () => await axiosInstance.post("/user/logout");
