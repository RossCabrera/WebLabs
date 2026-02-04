import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Convert the module URL to a file path and get the directory name
const __dirname = dirname(fileURLToPath(import.meta.url));

// Create an Express application
const app = express();

// Define the port your server will listen on
const port = 3000;

// ===================== MIDDLEWARE =====================

// Parse incoming JSON requests (e.g., from Postman raw JSON)
// This populates req.body with a JS object if JSON is sent
app.use(express.json());

// Parse URL-encoded form data (from HTML forms or Postman x-www-form-urlencoded)
// This also populates req.body with a JS object
app.use(express.urlencoded({ extended: true }));

// ===================== ROUTES =====================

// GET route for the home page
// Sends an HTML file located in the "public" folder
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// POST route to handle form submissions or JSON data
app.post("/submit", (req, res) => {
  // req.body now contains the parsed data from the client
  console.log("Body received:", req.body);

  // Respond back to the client with a JSON object
  // This prevents Postman or browser from hanging
  res.json({ received: req.body });
});

// ===================== START SERVER =====================

// Start the server and listen on the defined port
// The callback runs once the server is ready
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

