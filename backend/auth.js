import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "./supabase.js";

const router = express.Router();

router.post("/signup/business", async (req, res) => {
  try {
   const { businessName, ownerName, email, password, city, postcode } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
      business_name: businessName,
      owner_name: ownerName,
      owner_email: email,
      city: city,
      postcode: postcode
    })

      .select()
      .single();

    if (businessError) {
      return res.status(400).json({ error: businessError.message });
    }

    const { error: userError } = await supabase
      .from("users")
      .insert({
        business_id: business.id,
        full_name: ownerName,
        email,
        password_hash: passwordHash,
        role: "business_owner"
      });

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    res.json({
      success: true,
      trialEnds: business.trial_end
    });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        businessId: user.business_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
  token,
  role: user.role,
  businessId: user.business_id,
  fullName: user.full_name
});


  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
