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

// Base URL for the API
const API_URL = "https://secrets-api.appbrewery.com";

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Authentication credentials
const yourUsername = "HERE_YOUR_USERNAME";
const yourPassword = "HERE_YOUR_PASSWORD";
const yourAPIKey = "HERE_YOUR_API_KEY";
const yourBearerToken = "HERE_YOUR_BEARER_TOKEN";

// Routes
app.get("/", async (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

// Route to demonstrate no authentication
app.get("/noAuth", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/random");
    res.render("index.ejs", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Route to demonstrate Basic Authentication
app.get("/basicAuth", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/all?page=2", {
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Route to demonstrate API Key Authentication
app.get("/apiKey", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/filter", {
      params: {
        score: 5,
        apiKey: yourAPIKey,
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Route to demonstrate Bearer Token Authentication
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.get("/bearerToken", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/secrets/2", config);
    res.render("index.ejs", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ Application is ready!`);
});
