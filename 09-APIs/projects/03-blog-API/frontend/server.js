import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.FRONTEND_PORT;
const API_URL = `http://localhost:${process.env.API_PORT}`;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Home
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index", { posts: response.data });
  } catch (error) {
    res.send("Error loading posts");
  }
});

// New
app.get("/new", (req, res) => {
  res.render("modify", {
    heading: "New Post",
    submit: "Create Post",
    post: null,
  });
});

// Edit
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("modify", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.send("Error loading post");
  }
});

// Create
app.post("/api/posts", async (req, res) => {
  await axios.post(`${API_URL}/posts`, req.body);
  res.redirect("/");
});

// Update
app.post("/api/posts/:id", async (req, res) => {
  await axios.patch(`${API_URL}/posts/${req.params.id}`, req.body);
  res.redirect("/");
});

// Delete
app.post("/delete/:id", async (req, res) => {
  await axios.delete(`${API_URL}/posts/${req.params.id}`);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`🌐 Frontend running on http://localhost:${PORT}`);
});
