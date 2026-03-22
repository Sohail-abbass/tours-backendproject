import { Router } from "express";
import pool from "../config/postgres";

const router = Router();


// ✅ GET ALL PACKAGES
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM packages ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching packages" });
  }
});


// ✅ GET SINGLE PACKAGE
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM packages WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching package" });
  }
});


// ✅ CREATE PACKAGE
router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      duration,
      price,
            currency = "PKR",
      description,
      main_image
    } = req.body;

    const result = await pool.query(
      `INSERT INTO packages 
       (title, slug, duration, price, currency, description, main_image)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [title, slug, duration, price, currency, description, main_image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error("CREATE ERROR:", error); // 🔥 VERY IMPORTANT

    res.status(500).json({ message: "Error creating package" });
  }
});


// ✅ UPDATE PACKAGE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, duration } = req.body;

    const result = await pool.query(
      `UPDATE packages
       SET title=$1, price=$2, duration=$3, updated_at=now()
       WHERE id=$4
       RETURNING *`,
      [title, price, duration, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating package" });
  }
});


// ✅ DELETE PACKAGE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM packages WHERE id = $1",
      [id]
    );

    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting package" });
  }
});

export default router;