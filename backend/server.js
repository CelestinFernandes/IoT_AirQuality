const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider (e.g., 'gmail', 'yahoo', 'hotmail')
  auth: {
    user: "mincelichan@gmail.com", // Replace with your email
    pass: "ggdp oldr kgbn ioxw",    // Replace with your app password
  },
});

// Endpoint to send emails
app.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: "mincelichan@gmail.com", // Sender's email
    to,                          // Recipient's email
    subject,                     // Email subject
    text,                        // Email body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send email", error });
    }
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully", response: info.response });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
