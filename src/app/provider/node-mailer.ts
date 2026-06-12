import nodemailer from "nodemailer";

// Create a transporter using Gmail
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Your full Gmail address (e.g., example@gmail.com)
    pass: process.env.SMTP_PASS, // Your 16-character App Password (NOT your regular password)
  },
});
