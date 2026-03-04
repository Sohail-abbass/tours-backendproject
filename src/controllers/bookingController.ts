import { Request, Response } from "express";
import pool from "../config/postgres";
import { sendBookingEmail } from "../utils/sendMail";

export const createBooking = async (req: Request, res: Response): Promise<void> => {

  try {

    const {
      bookingType,
      itemId,
      customerName,
      customerEmail,
      customerPhone,
      travelers,
      packageType,
      message,
      travelDate
    } = req.body;

    let item;
    let totalPrice = 0;

    // TOUR BOOKING
    if (bookingType === "tour") {

      const tour = await pool.query(
        "SELECT * FROM tours WHERE id=$1 AND status='active'",
        [itemId]
      );

      if (tour.rows.length === 0) {
        res.status(404).json({ success:false, message:"Tour not found"});
        return;
      }

      item = tour.rows[0];

      const priceMap:any = {
        solo: item.solo,
        couple: item.couple,
        deluxe: item.deluxe
      };

      totalPrice = priceMap[packageType] * travelers;
    }

    // PACKAGE BOOKING
    else {

      const pkg = await pool.query(
        "SELECT * FROM packages WHERE id=$1 AND status='active'",
        [itemId]
      );

      if (pkg.rows.length === 0) {
        res.status(404).json({ success:false, message:"Package not found"});
        return;
      }

      item = pkg.rows[0];

      totalPrice = item.price * travelers;
    }

    // CREATE BOOKING
    const result = await pool.query(

      `INSERT INTO bookings
      (booking_type,item_id,item_title,customer_name,customer_email,
      customer_phone,travelers,package_type,total_price,message,travel_date)

      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *`,

      [
        bookingType,
        itemId,
        item.title,
        customerName,
        customerEmail,
        customerPhone,
        travelers,
        packageType,
        totalPrice,
        message,
        travelDate
      ]
    );

    const booking = result.rows[0];

    // booking reference
    const bookingRef = `BK-${booking.id.slice(-6).toUpperCase()}`;

    await sendBookingEmail({
      bookingRef,
      bookingType,
      itemTitle: booking.item_title,
      customerName,
      customerEmail,
      customerPhone,
      travelers,
      totalPrice,
      message
    });

    res.status(201).json({
      success:true,
      message:"Booking created successfully",
      data: booking
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:"Server error",
      error:(error as Error).message
    });

  }

};export const updateBooking = async (req: Request, res: Response): Promise<void> => {

  try {

    const { status, paymentStatus, notes } = req.body;

    const result = await pool.query(

      `UPDATE bookings
      SET status=$1, payment_status=$2, notes=$3, updated_at=now()
      WHERE id=$4
      RETURNING *`,

      [status, paymentStatus, notes, req.params.id]
    );

    if(result.rows.length === 0){
      res.status(404).json({ success:false, message:"Booking not found"});
      return;
    }

    res.json({
      success:true,
      data: result.rows[0]
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:"Update error"
    });

  }

};export const getBookingStats = async (req: Request, res: Response): Promise<void> => {

  try {

    const stats = await pool.query(`
      SELECT status, COUNT(*) as count, SUM(total_price) as revenue
      FROM bookings
      GROUP BY status
    `);

    const revenue = await pool.query(`
      SELECT SUM(total_price) as total
      FROM bookings
      WHERE payment_status='paid'
    `);

    res.json({
      success:true,
      data:{
        statusBreakdown: stats.rows,
        totalRevenue: revenue.rows[0].total || 0
      }
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:"Stats error"
    });

  }

};