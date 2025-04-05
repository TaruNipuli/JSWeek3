import promisePool from "../../utils/database.js";

const listAllCats = async () => {
  const [rows] = await promisePool.execute(`
    SELECT wsk_cats.*, wsk_users.name AS owner_name
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
  `);
  console.log("rows", rows);
  return rows;
};

const findCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `
    SELECT wsk_cats.*, wsk_users.name AS owner_name
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
    WHERE cat_id = ?
  `,
    [id]
  );
  console.log("rows", rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addCat = async (cat) => {
  const { cat_name, weight, owner, filename, birthdate } = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const rows = await promisePool.execute(sql, params);
  console.log("rows", rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return { cat_id: rows[0].insertId };
};

const modifyCat = async (cat, id, userId, role) => {
  try {
    let sql, params;

    if (role === "admin") {
      // Admins can update any cat
      sql = "UPDATE wsk_cats SET ? WHERE cat_id = ?";
      params = [cat, id];
    } else {
      // Regular users can only update their own cats
      sql = "UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?";
      params = [cat, id, userId];
    }

    const [rows] = await promisePool.execute(sql, params);
    console.log("rows", rows);

    if (rows.affectedRows === 0) {
      return false; // No rows affected, cat not found or not authorized
    }

    return { message: "success" };
  } catch (error) {
    console.error("Error updating cat:", error);
    throw error;
  }
};

const removeCat = async (id, userId, role) => {
  try {
    let sql, params;

    if (role === "admin") {
      // Admins can delete any cat
      sql = "DELETE FROM wsk_cats WHERE cat_id = ?";
      params = [id];
    } else {
      // Regular users can only delete their own cats
      sql = "DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?";
      params = [id, userId];
    }

    const [rows] = await promisePool.execute(sql, params);
    console.log("rows", rows);

    if (rows.affectedRows === 0) {
      return false; // No rows affected, cat not found or not authorized
    }

    return { message: "success" };
  } catch (error) {
    console.error("Error in deleting cat:", error);
    throw error;
  }
};

export { listAllCats, findCatById, addCat, modifyCat, removeCat };
