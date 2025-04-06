import express from "express";
import { body } from "express-validator";
import { validationErrors } from "../../validators.js";
import { postUser } from "../controllers/user-controller.js";

const userRouter = express.Router();

// Validation and sanitization for user registration
userRouter.post(
  "/",
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3-20 characters long")
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric"),
  body("email").trim().isEmail().withMessage("Invalid email address"),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validationErrors, // Middleware to handle validation errors
  postUser // Controller to handle the request
);

export default userRouter;
