import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// ==================== MIDDLEWARE ====================
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Custom Middleware
app.use((req, res, next) =>{
  console.log(`[Custom Logger] ${req.method} ${req.url} at ${new Date().toISOString()}`)
  next();
});

// ==================== ROUTES ====================
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  const { name, email } = req.body;
  console.log("Body received:", req.body); 

  res.send(`
    <h1>Thank you, ${name}!</h1>
    <p>We received your email: ${email}</p>
    <a href="/">Go back</a>
  `);
});


// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error("Error caught:", err.stack);
  res.status(500).send("Something went wrong!");
});

// ==================== START SERVER ====================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});