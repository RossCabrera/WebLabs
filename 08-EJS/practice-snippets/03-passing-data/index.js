import express from "express";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==================== ROUTES ====================

app.get("/", (req, res) => {
  res.render("index", { message: "Enter your name below 👇" });
});

app.post("/submit", (req, res) => {
  const firstName = req.body.fName || "";
  const lastName = req.body.lName || "";

  const fullName = `${firstName.trim()}${lastName.trim()}`;

  let message;
  if (fullName.length > 0) {
    message = `There are ${fullName.length} letters in your name.`;
  } else {
    message = "Enter your name below 👇";
  }

  res.render("index", { message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
