import express from "express";
import cors from "cors";
import "dotenv/config";
import { pool } from "./db.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/tours", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tours ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load tours" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
