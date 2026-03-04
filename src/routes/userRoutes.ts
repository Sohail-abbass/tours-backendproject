import { Router } from "express";
import pool from "../config/postgres";

const router = Router();


// GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, is_active FROM users"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});


// GET SINGLE USER
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id=$1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});


// CREATE USER
router.post("/", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, email, role`,
      [name, email, password, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});


// UPDATE USER
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name=$1, role=$2, updated_at=now()
       WHERE id=$3
       RETURNING id, name, role`,
      [name, role, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});


// DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM users WHERE id=$1",
      [id]
    );

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;