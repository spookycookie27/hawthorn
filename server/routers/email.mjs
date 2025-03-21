import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure the transporter for Hotmail

router.post("/send", async (req, res) => {
  const { email, message, name, telephone } = req.body;
  const subjectLine = `Website contact from ${name}`;
  const messageLines = `Message: ${message}\nTel: ${telephone}\nEmail: ${email}`;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Hotmail email address
        pass: process.env.GMAIL_PASS, // Your Hotmail email password
      },
    });
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: subjectLine,
      text: messageLines,
    });

    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
