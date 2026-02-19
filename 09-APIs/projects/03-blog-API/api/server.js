import express from "express";
import dotenv from "dotenv";
import postRoutes from "./routes/postRoutes.js";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.API_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
