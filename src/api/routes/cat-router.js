import {
  deleteCat,
  getCat,
  getCatById,
  postCat,
  putCat,
  getCatsByUserId,
} from "../controllers/cat-controller.js";

import express from "express";
import multer from "multer";
import { authenticateToken, authorizeOwner } from "../../middlewares.js"; // Import middlewares

const catRouter = express.Router();

const upload = multer({ dest: "uploads/" });

// Middleware to get the owner of the cat
const getCatOwnerId = async (catId) => {
  const cat = await getCatById(catId); // Fetch the cat from the database
  return cat.user_id; // Return the owner's user ID
};

// Public routes
catRouter
  .route("/")
  .get(getCat)
  .post(authenticateToken, upload.single("file"), postCat);

// Protected routes: Only the owner can update or delete a cat
catRouter
  .route("/:id")
  .get(getCatById)
  .put(authenticateToken, authorizeOwner(getCatOwnerId), putCat)
  .delete(authenticateToken, authorizeOwner(getCatOwnerId), deleteCat);

// Route to get cats by user ID
catRouter.route("/user/:userId").get(authenticateToken, getCatsByUserId);

export default catRouter;
