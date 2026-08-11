import { Router } from "express";
import { asyncHandler } from "../utils/handler.utils.js";
import {
  createUserProfile,
  getUserProfile,
  login,
  logout,
  register,
  updateUserProfile,
  userAuthenticateStatus,
} from "../controllers/auth.controller.js";

const route = Router();

route.post("/register", asyncHandler(register));
route.post("/login", asyncHandler(login));
route.post("/logout", asyncHandler(logout));
route.get("/status", asyncHandler(userAuthenticateStatus));
route.route("/profile")
  .get(asyncHandler(getUserProfile))
  .patch(asyncHandler(updateUserProfile))
  .post(asyncHandler(createUserProfile));

export default route;
