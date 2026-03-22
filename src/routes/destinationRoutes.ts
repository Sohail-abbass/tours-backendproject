import { Router } from "express";
import pool from "../config/postgres";

const router = Router();


// GET ALL DESTINATIONS
router.get("/", async (req, res) => {
  try {
        console.log("Destinations API hit");

    const result = await pool.query(
      "SELECT * FROM destinations ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
        console.error("DESTINATION ERROR:", error);

    res.status(500).json({ message: "Error fetching destinations" });
  }
});


// GET SINGLE DESTINATION
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM destinations WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Destination not found" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching destination" });
  }
});


// CREATE DESTINATION
router.post("/", async (req, res) => {
  try {
    const { name, slug, region } = req.body;

    const result = await pool.query(
      `INSERT INTO destinations (name, slug, region)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [name, slug, region]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating destination" });
  }
});


// UPDATE DESTINATION
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, region } = req.body;

    const result = await pool.query(
      `UPDATE destinations
       SET name=$1, region=$2, updated_at=now()
       WHERE id=$3
       RETURNING *`,
      [name, region, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating destination" });
  }
});


// DELETE DESTINATION
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM destinations WHERE id=$1",
      [id]
    );

    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting destination" });
  }
});

export default router;