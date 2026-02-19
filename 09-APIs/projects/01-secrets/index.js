import express from "express";
import axios from "axios";

// Create Express application instance
const app = express();
const PORT = process.env.PORT || 3000;

// Base URL for the API
const API_URL = "https://secrets-api.appbrewery.com";

// Set EJS templating engine
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to fetch and display a random secret
app.get("/", async(req, res) => {
  try {
    const result = await axios.get(API_URL + "/random");

    res.render("index.ejs", {
      secret: result.data.secret,
      user: result.data.username,
    });

  } catch (error) {
    res.render("index", {
        secret: "❌ Failed to fetch secret.",
        user: "System",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ Application is ready!`);
});

