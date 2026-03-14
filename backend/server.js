import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, app: "Pixelly API" });
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Pixelly API running on http://localhost:${port}`);
});
