import express from "express";
import {
  getJokes,
  getRandomJoke,
  getJokeById,
  createJoke,
  replaceJoke,
  updateJoke,
  deleteJoke,
  deleteAllJokes
} from "../controllers/jokesController.js";

const router = express.Router();


// ==========================
// GET
// ==========================
router.get("/", getJokes);
router.get("/random", getRandomJoke);
router.get("/:id", getJokeById);


// ==========================
// POST
// ==========================
router.post("/", createJoke);


// ==========================
// PUT
// ==========================
router.put("/:id", replaceJoke);


// ==========================
// PATCH
// ==========================
router.patch("/:id", updateJoke);


// ==========================
// DELETE
// ==========================
router.delete("/:id", deleteJoke);
router.delete("/", deleteAllJokes);


export default router;
