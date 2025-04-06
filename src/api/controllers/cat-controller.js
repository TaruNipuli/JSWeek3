import { addCat, findCatById, listAllCats } from "../models/cat-model.js";

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = async (req, res, next) => {
  try {
    const cat = await findCatById(req.params.id);

    if (!cat) {
      const error = new Error("Cat not found");
      error.status = 404;
      throw error; // Error handled by the error handler
    }

    res.json(cat); // Return cat if found
  } catch (error) {
    next(error); // Pass error to the error handler middleware
  }
};

const postCat = async (req, res, next) => {
  try {
    const result = await addCat(req.body);

    if (!result.cat_id) {
      const error = new Error("Failed to add cat");
      error.status = 400;
      throw error; // Error handled by the error handler
    }

    res.status(201).json({ message: "New cat added.", result });
  } catch (error) {
    next(error); // Pass error to the error handler middleware
  }
};

const putCat = async (req, res) => {
  try {
    const { user_id, role } = res.locals.user;
    const catId = req.params.id;
    const data = req.body;

    const result = await modifyCat(data, catId, user_id, role);
    if (result) {
      res.status(200).json({ message: "Cat updated successfully" });
    } else {
      res.status(404).json({ message: "Cat not found or not authorized" });
    }
  } catch (error) {
    console.error("Error updating cat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCat = async (req, res) => {
  try {
    const { user_id, role } = res.locals.user;
    const catId = req.params.id;

    const result = await removeCat(catId, user_id, role);
    if (result) {
      res.status(200).json({ message: "Cat deleted successfully" });
    } else {
      res.status(404).json({ message: "Cat not found or not authorized" });
    }
  } catch (error) {
    console.error("Error deleting cat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCatsByUserId = async (req, res) => {
  const userId = req.params.userId;
  const [rows] = await promisePool.execute(
    "SELECT * FROM wsk_cats WHERE owner = ?",
    [userId]
  );
  if (rows.length > 0) {
    res.json(rows);
  } else {
    res.status(404).send({ message: "No cats found for this user." });
  }
};

export { getCat, getCatById, postCat, putCat, deleteCat, getCatsByUserId };
