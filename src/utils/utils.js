import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../utils/email.js";
import { Company } from "../models/companymodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { Admin } from "../models/adminmodel.js";

dotenv.config({ path: "./configenv.env" });

// Generates a JSON Web Token (JWT) for a user.
const jwtsecret = process.env.JWT_SECRET;
export const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, jwtsecret, {
    expiresIn: "1d",
    // expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
export const emailConfirmationToken = (id, userType) => {
  return jwt.sign({ id, userType }, jwtsecret, {
    expiresIn: "1d",
    // expiresIn: process.env.EMAIL_CONFIRMATION_EXPIRES_IN,
  });
};
export const passwordMatch = (password, passwordConfirm) => {
  return password === passwordConfirm;
};
// Function to send confirmation email
export async function sendConfirmationEmail(userEmail, token) {
  try {
    const confirmationUrl = `https://legalmo-server.onrender.com/api/useremail/confirm/${token}`;
    const currentUrl = "https://legalmo-server.onrender.com/";
    // const confirmationUrl = `http://localhost:5005/api/useremail/confirm/${token}`;
    // const currentUrl = "http://localhost:5005/";

    await sendEmail({
      email: userEmail,
      subject: "Verify Email Address",
      message: `Click this link to confirm your email: ${confirmationUrl}`,
      html: `
         <p>Verify your email to complete your signup and login into your account</p>
         <p>This link <b>expires in 6 hours</b>.</p>
         <p>Click <a href="${currentUrl}api/useremail/confirm/${token}">here</a> to proceed.</p>
       `,
    });

    // Return true to indicate that the email was successfully sent
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    // Return false to indicate that there was an error sending the email
    return false;
  }
}

export const doesUserExist = async (officialEmail) => {
  const existingUser =
    (await Lawyer.findOne({ officialEmail })) ||
    (await Admin.findOne({ officialEmail })) ||
    (await Company.findOne({ officialEmail }));

  return !!existingUser;
};
