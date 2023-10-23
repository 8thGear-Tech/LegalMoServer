import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Company } from "../models/companymodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { Admin } from "../models/adminmodel.js";

dotenv.config({ path: "./configenv.env" });

// Generates a JSON Web Token (JWT) for a user.
const jwtsecret = process.env.JWT_SECRET;
export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "legalmo Inc",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, jwtsecret);

    if (!decoded) {
      // Invalid or expired token
      return res.status(400).send("Invalid token or expired token.");
    }

    // Check if the token has expired
    const currentTime = Date.now();
    if (decoded.exp * 1000 < currentTime) {
      // Token has expired
      return res.status(400).send("Token has expired.");
    }

    // Determine the user type from the token payload
    const userType = decoded.userType;

    // Find the user by their ID (decoded from the token) based on the user type
    let user;

    if (userType === "admin") {
      user = await Admin.findById(decoded.id);
    } else if (userType === "company") {
      user = await Company.findById(decoded.id);
    } else if (userType === "lawyer") {
      user = await Lawyer.findById(decoded.id);
    } else {
      return res.status(400).send("Invalid user type.");
    }

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Check if the email is already confirmed
    if (user.isEmailConfirmed) {
      return res.status(400).send("Email already confirmed.");
    }

    // Mark the user's email as confirmed
    user.isEmailConfirmed = true;
    await user.save();

    // Optionally, you can redirect the user to a login page or show a confirmation success message.
    res
      .status(200)
      .send(` ${userType} Email confirmed successfully. You can now log in.`);
  } catch (error) {
    console.error("Email confirmation error:", error);
    res.status(400).send("Invalid or expired token.");
  }
};
