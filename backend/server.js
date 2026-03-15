import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.js";
import supabase from "./supabase.js";


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
app.get("/api/bookings", async (_req, res) => {

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }

  res.json(data);

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
app.post("/api/bookings", async (req, res) => {

  const booking = {
    studio: req.body.studio,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    shoottype: req.body.shootType,
    date: req.body.date,
    notes: req.body.notes,
    status: "pending"
  };

  const { data, error } = await supabase
    .from("bookings")
    .insert([booking])
    .select();

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Database insert failed" });
  }

  res.json({ success: true, booking: data });

});


/*
---------------------------------------
GET ALL BOOKINGS
---------------------------------------
*/
app.get("/api/bookings", (_req, res) => {
  res.json(bookings);
});

app.patch("/api/bookings/:id", (req, res) => {

  const id = Number(req.params.id);
  const { status } = req.body;

  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = status;

  res.json({ success: true, booking });

});

/*
--------------------------------
GET ALL BOOKINGS
--------------------------------
*/

app.get("/api/bookings", (_req, res) => {
  res.json(bookings);
});


/*
--------------------------------
GET ALL BUSINESSES (STUDIOS)
--------------------------------
*/

app.get("/api/studios", async (req, res) => {

  const { data, error } = await supabase
    .from("businesses")
    .select("id, business_name");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});



/*
---------------------------------------
START SERVER
---------------------------------------
*/
app.listen(port, () => {
  console.log(`Pixelly API running on http://localhost:${port}`);
});
