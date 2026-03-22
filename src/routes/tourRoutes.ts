
import {Router, Request, Response} from 'express';
import express from "express";
import pool from "../config/postgres";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tours" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM tours WHERE id = $1", [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Tour not found" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tour" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      location,
      days,
      nights,
      price
    } = req.body;

    const result = await pool.query(
      `INSERT INTO tours (title, slug, location, days, nights, price)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, slug, location, days, nights, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating tour" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;

    const result = await pool.query(
      `UPDATE tours 
       SET title=$1, price=$2, updated_at=now()
       WHERE id=$3
       RETURNING *`,
      [title, price, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Tour not found" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating tour" });
  }
});
router.delete("/:id", async (req, res) => {
  try {

const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM tours WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Tour not found"
      });
    }

    res.json({
      message: "Tour deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error deleting tour"
    });

  }
});

export default router;
