import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

// Convertir import.meta.url a ruta de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to fetch and display a random activity
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", {
      data: result,
      error: null
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      data: null,
      error: error.message,
    });
  }
});

// Route to fetch and display a filtered activity
app.post("/", async (req, res) => {
  const type = req.body.type;
  const participants = req.body.participants;

  try {
    const response = await axios.get(
      "https://bored-api.appbrewery.com/filter",
      {
        params: {
          type: type || undefined,
          participants: participants || undefined,
        },
      }
    );

    const activities = response.data;

    // pick random activity from array
    const randomIndex = Math.floor(Math.random() * activities.length);
    const randomActivity = activities[randomIndex];

    res.render("index.ejs", {
      data: randomActivity,
      error: null
    });

  } catch (error) {

    if (error.response && error.response.status === 404) {
      res.render("index.ejs", {
        data: null,
        error: "No activities that match your criteria.",
      });
    } else {
      res.render("index.ejs", {
        data: null,
        error: "Something went wrong.",
      });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ Application is ready!`);
});

