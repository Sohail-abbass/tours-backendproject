import "../config/env"; // ✅ THIS LINE FIXES YOUR ISSUE

import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});
console.log("REFRESH TOKEN:", process.env.GMAIL_REFRESH_TOKEN);

console.log("ENV TEST:", {
  refresh: process.env.GMAIL_REFRESH_TOKEN,
  user: process.env.GMAIL_USER,
});
export const sendContactEmail = async ({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token as string,
      },
    });

    await transporter.sendMail({
      from: `"Tours & Travel Website" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📩 Contact Form: ${subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });
  } catch (error) {
    console.error("EMAIL DEBUG ERROR:", error);

    throw new Error("Email service failed");
  }
};
export const sendBookingEmail = async ({
  bookingRef,
  bookingType,
  itemTitle,
  customerName,
  customerEmail,
  customerPhone,
  travelers,
  totalPrice,
  message,
}: {
  bookingRef: string;
  bookingType: string;
  itemTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelers: number;
  totalPrice: number;
  message?: string;
}) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token as string,
      },
    });

    // 🔹 Admin Notification Email
    await transporter.sendMail({
      from: `"Tours & Travel Website" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🧾 New Booking Received - ${bookingRef}`,
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#2E86C1;">New Package Booking</h2>
          <hr/>
          <p><b>Booking Reference:</b> ${bookingRef}</p>
          <p><b>Booking Type:</b> ${bookingType}</p>
          <p><b>Package:</b> ${itemTitle}</p>
          <p><b>Name:</b> ${customerName}</p>
          <p><b>Email:</b> ${customerEmail}</p>
          <p><b>Phone:</b> ${customerPhone}</p>
          <p><b>Travelers:</b> ${travelers}</p>
          <p><b>Total Price:</b> Rs ${totalPrice}</p>
          <p><b>Message:</b> ${message || "N/A"}</p>
          <br/>
          <p style="color:gray;">Please contact the customer as soon as possible.</p>
        </div>
      `,
    });

    // 🔹 Customer Confirmation Email
    await transporter.sendMail({
      from: `"Tours & Travel Website" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject: `✅ Booking Confirmation - ${bookingRef}`,
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#28B463;">Thank You for Your Booking 🎉</h2>
          <p>Dear ${customerName},</p>
          <p>Your booking has been received successfully.</p>
          <hr/>
          <p><b>Booking Reference:</b> ${bookingRef}</p>
          <p><b>Package:</b> ${itemTitle}</p>
          <p><b>Travelers:</b> ${travelers}</p>
          <p><b>Total Price:</b> Rs ${totalPrice}</p>
          <p><b>Status:</b> Pending Confirmation</p>
          <br/>
          <p>Our team will contact you shortly to confirm the details.</p>
          <br/>
          <p>Best Regards,<br/>Tours & Travel Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Booking email failed:", error);
    throw new Error("Booking email service failed");
  }
};
