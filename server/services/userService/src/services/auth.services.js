import models from "../models/index.cjs";
import { appError } from "../utils/appError.utils.js";
import bcrypt from "bcrypt";
import { filterProfileData } from "../utils/auth.utils.js";

const { User, Profile } = models;

export const loginService = async (email, password, req) => {
  const user = await User.scope(null).findOne({ where: { email } });

  if (!user) appError("Invalid Credentials", 400);

  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) appError("Invalid Credentials", 400);

  return { message: "successfully logged In", userId: user.id };
};

export const registerService = async (username, email, password, role, req) => {
  const user = await User.findOne({ where: { email } });

  if (user) appError("user already exist", 400);

  const newUser = await User.create({ username, email, password, role });

  return { message: "successfully registered", userId: newUser.id };
};

export const fetchUserService = async (id) => {
  const user = await User.findByPk(id);
  return { msg: "user successfully authenticated", data: user };
};

export const logoutService = async () => {
  return { message: "successfully logged out", action: "LOGOUT" };
};

export const createUserProfileService = async (
  city,
  fullName,
  area,
  state,
  country,
  address,
  phoneNumber,
  userId,
) => {
  const user = await User.findOne({where: {userId}});

  if (user) appError("profile already exist", 400);

  const profile = await Profile.create({
    city,
    fullName,
    area,
    state,
    country,
    address,
    phoneNumber,
    userId,
  });

  return { message: "successfully created user profile", data: profile };
};

export const getUserProfileService = async (userId) => {
  const userProfile = await User.findByPk(userId, {
    include: [
      {
        model: Profile,
        required: true,
      },
    ],
  });

  if (!userProfile) appError("No profile found. Create yours today", 404);

  return {
    message: "successfully fetched user profile",
    data: userProfile.Profile,
  };
};

export const updateUserProfileService = async (userId, profileData) => {
  console.log("reached", profileData);
  
  if (!profileData || !profileData.id)
    appError("required details not found", 400);

  const profileDetails = filterProfileData(profileData);
console.log(profileDetails);

  const userProfile = await Profile.findOne({ where: { userId } });

  if (!userProfile) appError("No profile found. Create yours today", 404);

  await userProfile.update(profileDetails);

  console.log(userProfile);

  return { message: "successfully updated user profile", data: userProfile };
};
