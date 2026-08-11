import { axiosInstance } from "../../lib/axios";

export const createProfileService = async (data) =>
  await axiosInstance.post("/user/profile", data);
export const getProfileService = async () =>
  await axiosInstance.get("/user/profile");
export const updateProfileService = async (data) =>
  await axiosInstance.patch("/user/profile", data);
