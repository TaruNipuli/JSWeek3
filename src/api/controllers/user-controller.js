import {
  addUser,
  findUserById,
  listAllUsers,
  removeUser,
} from "../models/user-model.js";

import bcrypt from "bcrypt";

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const cat = findUserById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const result = await addUser(req.body);
  console.log("result", result);
  if (result.user_id) {
    res.status(201);
    res.json({ message: "New user added.", result });
  } else {
    res.sendStatus(400);
  }
};

const putUser = async (req, res) => {
  const result = await modifyUser(req.body, req.params.id);
  if (result.message) {
    res.status(200);
    res.json(result);
  } else {
    res.sendStatus(400);
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const result = await removeUser(userId);

  if (result.message === "success") {
    res
      .status(200)
      .send({ message: "User and associated cats deleted successfully." });
  } else if (result.message === "User not found") {
    res.status(404).send({ message: "User not found" });
  } else {
    res.status(500).send({ message: "Transaction failed" });
  }
};

export { getUser, getUserById, postUser, putUser, deleteUser };
