import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "../models/user-model.js";
import "dotenv/config";

const authUser = async (req, res) => {
  try {
    const result = await getUserByUsername(req.body.username);

    // Check if user exists
    if (!result) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // Validate password
    const passwordValid = bcrypt.compareSync(
      req.body.password,
      result.password
    );
    console.log("Password is valid:", passwordValid);

    if (!passwordValid) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    // Remove password from user object
    const userWithNoPassword = {
      user_id: result.user_id,
      name: result.name,
      username: result.username,
      email: result.email,
      role: result.role,
    };

    // Generate JWT token
    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Send response
    res.json({ user: userWithNoPassword, token });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMe = async (req, res) => {
  console.log("getMe", res.locals.user);
  if (res.locals.user) {
    res.json({ message: "token ok", user: res.locals.user });
  } else {
    res.sendStatus(401);
  }
};

export { authUser, getMe };
