import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

/*
---------------------------------------
TEMP BOOKING STORAGE (for testing)
---------------------------------------
This stores bookings in memory.
Later we will move this to Supabase.
*/
let bookings = [];

/*
---------------------------------------
HEALTH CHECK
---------------------------------------
*/
app.get("/healthz", (_req, res) => {
  res.json({ ok: true, app: "Pixelly API" });
});

/*
---------------------------------------
AUTH ROUTES
---------------------------------------
*/
app.use("/api/auth", authRoutes);

/*
---------------------------------------
CREATE BOOKING
---------------------------------------
*/
app.post("/api/bookings", (req, res) => {

  const booking = {
    id: Date.now(),
    ...req.body
  };

  bookings.push(booking);

  console.log("New booking received:", booking);

  res.json({ success: true });

});

/*
---------------------------------------
GET ALL BOOKINGS
---------------------------------------
*/
app.get("/api/bookings", (_req, res) => {
  res.json(bookings);
});

/*
---------------------------------------
START SERVER
---------------------------------------
*/
app.listen(port, () => {
  console.log(`Pixelly API running on http://localhost:${port}`);
});
