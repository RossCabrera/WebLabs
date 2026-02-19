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
const yourBearerToken = "HERE_YOUR_BEARER_TOKEN";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

// Helper function to handle errors
function handleError(res, error) {
  const errorMessage =
    error.response?.data?.message || error.response?.data || error.message;

  res.render("index", {
    content: `❌ Error:\n${JSON.stringify(errorMessage, null, 2)}`,
  });
}

// Routes for REST API operations
app.get("/", (req, res) => {
  res.render("index", { content: "Waiting for data..." });
});


app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/post-secret", async (req, res) => {
  try {
    const result = await axios.post(API_URL + "/secrets", req.body, config);
    res.render("index", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.put(
      API_URL + "/secrets/" + searchId,
      req.body,
      config,
    );
    res.render("index", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.patch(
      API_URL + "/secrets/" + searchId,
      req.body,
      config,
    );
    res.render("index", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.delete(API_URL + "/secrets/" + searchId, config);
    res.render("index", { content: JSON.stringify(result.data, null, 2) });
  } catch (error) {
    handleError(res, error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`✅ Application is ready!`);
});
