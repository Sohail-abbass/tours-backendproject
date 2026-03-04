import { Request, Response } from "express";
import pool from "../config/postgres";
import { sendContactEmail } from "../utils/sendMail";

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📥 Contact request received");

    const { name, email, phone, subject, message } = req.body;

    // ✅ Save to PostgreSQL (Supabase)
    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, subject, message)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [name, email, phone, subject, message]
    );

    console.log("✅ Saved to DB:", result.rows[0]);

    // ✅ Send Email (same logic)
    await sendContactEmail({ name, email, phone, subject, message });

    console.log("📧 Email sent successfully");

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.log("email failed but contact saved:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit contact",
      error: (error as Error).message,
    });
  }
};