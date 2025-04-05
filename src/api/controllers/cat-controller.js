import { addCat, findCatById, listAllCats } from "../models/cat-model.js";

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = async (req, res) => {
  try {
    const cat = await findCatById(req.params.id);

    if (cat) {
      res.json(cat); // Return the cat if found
    } else {
      res.status(404).json({ message: "Cat not found" });
    }
  } catch (error) {
    console.error("Error fetching cat by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const postCat = (req, res) => {
  const result = addCat(req.body);
  if (result.cat_id) {
    res.status(201);
    res.json({ message: "New cat added.", result });
  } else {
    res.sendStatus(400);
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
