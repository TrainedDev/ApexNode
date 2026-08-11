import {
  loginService,
  logoutService,
  registerService,
  createUserProfileService,
  getUserProfileService,
  fetchUserService,
  updateUserProfileService,
} from "../services/auth.services.js";
import { appError } from "../utils/appError.utils.js";
import { responseClient } from "../utils/responseClient.utils.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) appError("required fields not found", 400);

  const response = await loginService(email, password, req);

  responseClient(res, 200, response);
};

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password)
    appError("required fields not found", 400);

  const response = await registerService(username, email, password, role, req);

  responseClient(res, 201, response);
};

export const logout = async (req, res) => {
  const response = await logoutService();
  
  responseClient(res, 200, response);
};

export const createUserProfile = async (req, res) => {
  const userId = req.headers["x-user-id"];
  console.log(req.body);

  const { fullName, address, phoneNumber, city, area, state, country } =
    req.body;

  if (!userId) appError("user not logged In", 401);

  if (
    !fullName ||
    !address ||
    !phoneNumber ||
    !area ||
    !state ||
    !country ||
    !city
  )
    appError("required fields not found", 400);

  const response = await createUserProfileService(
    city,
    fullName,
    area,
    state,
    country,
    address,
    phoneNumber,
    userId,
  );

  responseClient(res, 201, response);
};

export const userAuthenticateStatus = async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId) appError("user session expired or not logged in", 401);

  const response = await fetchUserService(userId);

  responseClient(res, 200, response);
};

export const getUserProfile = async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId) appError("user session expired or not logged in", 401);

  const response = await getUserProfileService(userId);

  responseClient(res, 200, response);
};

export const updateUserProfile = async (req, res) => {
  const userId = req.headers["x-user-id"];

  if (!userId) appError("user session expired or not logged in", 401);

  const response = await updateUserProfileService(userId, req.body);

  responseClient(res, 200, response);
};
