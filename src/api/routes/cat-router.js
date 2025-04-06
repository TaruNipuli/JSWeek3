import {
  deleteCat,
  getCat,
  getCatById,
  postCat,
  putCat,
  getCatsByUserId,
} from "../controllers/cat-controller.js";

import express from "express";
import { body } from "express-validator";
import {
  authenticateToken,
  authorizeOwner,
  upload,
} from "../../middlewares.js"; // Import upload and other middlewares
import { validationErrors } from "../../validators.js";

const catRouter = express.Router();

// Middleware to get the owner of the cat
const getCatOwnerId = async (catId) => {
  const cat = await getCatById(catId); // Fetch the cat from the database
  return cat.user_id; // Return the owner's user ID
};

// Public routes
catRouter
  .route("/")
  .get(getCat)
  .post(
    authenticateToken, // Ensure the user is authenticated
    upload.single("file"), // Handle file upload
    body("cat_name")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("Cat name must be 3-50 characters long"),
    body("weight")
      .isFloat({ min: 0 })
      .withMessage("Weight must be a positive number"),
    body("owner").isInt().withMessage("Owner must be an integer"),
    body("birthdate").isDate().withMessage("Birthdate must be a valid date"),
    validationErrors, // Middleware to handle validation errors
    postCat // Controller to handle the request
  );

// Protected routes: Only the owner can update or delete a cat
catRouter
  .route("/:id")
  .get(getCatById)
  .put(authenticateToken, authorizeOwner(getCatOwnerId), putCat)
  .delete(authenticateToken, authorizeOwner(getCatOwnerId), deleteCat);

// Route to get cats by user ID
catRouter.route("/user/:userId").get(authenticateToken, getCatsByUserId);

export default catRouter;
