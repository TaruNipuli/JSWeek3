import express from "express";
import api from "./api/index.js";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("Welcome to my Siili REST API");
});

app.use("/api/v1", api);

export default app;
