import express from "express";
import { authUser, getMe } from "../controllers/auth-controller.js"; // Corrected path
import { authenticateToken } from "../../middlewares.js";

const authRouter = express.Router();

// Login route
authRouter.route("/login").post(authUser);

// Protected route to get user info
authRouter.route("/me").get(authenticateToken, getMe);

export default authRouter;
