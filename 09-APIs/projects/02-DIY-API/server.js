import express from "express";
import dotenv from "dotenv";
import jokesRoutes from "./routes/jokesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/jokes", jokesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`✅ DIY API is ready!`);
});
