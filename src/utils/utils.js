import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import dns from "dns";
import { sendEmail } from "../utils/email.js";
import { Company } from "../models/companymodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { Admin } from "../models/adminmodel.js";

dotenv.config({ path: "./configenv.env" });

// Generates a JSON Web Token (JWT) for a user.
const jwtsecret = process.env.JWT_SECRET;
export const generateToken = (
  id,
  userType,
  officialEmail,
  phoneNumber,
  name
) => {
  return jwt.sign(
    { id, userType, officialEmail, phoneNumber, name },
    jwtsecret,
    {
      expiresIn: "7d",
      // expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};
export const emailConfirmationToken = (id, userType) => {
  return jwt.sign({ id, userType }, jwtsecret, {
    expiresIn: "7d",
    // expiresIn: process.env.EMAIL_CONFIRMATION_EXPIRES_IN,
  });
};
export const passwordMatch = (password, passwordConfirm) => {
  return password === passwordConfirm;
};
// Function to send confirmation email
export async function sendConfirmationEmail(userEmail, token, name) {
  // try {
  //   //  const currentUrl = "http://localhost:5005/";
  //   const currentUrl = "https://legalmo-server.onrender.com/";
  try {
    const currentUrl = "https://www.legalmo.biz/login";
    // const currentUrl = "http://www.legalmo.biz/login";

    await sendEmail({
      email: userEmail,
      subject: "Confirm Email Address",
      html: `
        <p>Hello ${name}</p>
        <p>Thank you for signing up</p>
        <p>To get you started, please click on the button below to confirm your email address</p>
        <a href="${currentUrl}?token=${token}" style="background-color: #4CAF50; color: white; padding: 15px 15px; text-align: center; text-decoration: none; display: inline-block; border-radius: 10px;" >Confirm Email</a>
        <p>If you didn't submit your email address to join our community, kindly ignore this email.</p>
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

export const checkInternetConnection = () => {
  return new Promise((resolve, reject) => {
    dns.resolve("www.google.com", (err) => {
      if (err) {
        reject(new Error("No internet connection"));
      } else {
        resolve();
      }
    });
  });
};
