import nodemailer from 'nodemailer';
import  jwt  from 'jsonwebtoken';
import dotenv from "dotenv";
import { Company } from '../models/companymodel.js';
import { Lawyer } from '../models/lawyermodel.js';
import { Admin } from '../models/adminmodel.js';
import { sendConfirmationEmail, emailConfirmationToken } from './utils.js';

dotenv.config ({ path: "./configenv.env" });

// Generates a JSON Web Token (JWT) for a user.
 const jwtsecret = process.env.JWT_SECRET;
export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from:'legalmo Inc',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    }

    await transporter.sendMail(mailOptions)
}

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtsecret);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(400).send('Token has expired.');
      } else {
        return res.status(400).send('Invalid token.');
      }
    }

    console.log('I got here 1')
    // Log the decoded token
    console.log('Decoded token:', decoded);

    // Determine the user type from the token payload
    const userType = decoded.userType;
    console.log('I got here 2')


      // Log the user ID and user type
    console.log('User ID:', decoded.id);
    console.log('User type:', userType);

    // Find the user by their ID (decoded from the token) based on the user type
    let user;

    if (userType === 'admin') {
      user = await Admin.findById(decoded.id);
    } else if (userType === 'company') {
      user = await Company.findById(decoded.id);
    } else if (userType === 'lawyer') {
      user = await Lawyer.findById(decoded.id);
    } else {
      return res.status(400).send('Invalid user type.');
    }

    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Check if the email is already confirmed
    if (user.isEmailConfirmed) {
      return res.status(400).send('Email already confirmed.');
    }

    // Mark the user's email as confirmed
    user.isEmailConfirmed = true;
    user.signupToken = token
    await user.save();

    // Optionally, you can redirect the user to a login page or show a confirmation success message.
    res.status(200).send(`${userType} Email Confirmed Successfully. You can now log in.`);
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).send('Internal server error.');
  }
};
    
export const resendConfirmationEmail = async (req, res) => {
  try {
    const { officialEmail } = req.body;

    // Find the user in the database
    const user = await Admin.findOne({ officialEmail }) 
      || await Lawyer.findOne({ officialEmail }) 
      || await Company.findOne({ officialEmail });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    // Generate a new confirmation token
    const { _id } = user;
    const userType = user instanceof Admin ? 'admin' : (user instanceof Lawyer ? 'lawyer' : 'company');
    const token = emailConfirmationToken(_id, userType);


    // Send the confirmation email
    if (!user.isEmailConfirmed){
      const emailSent = await sendConfirmationEmail(officialEmail, token, user.name);


      if (emailSent) {
        res.status(200).json({
          status: 'success',
          message: 'Confirmation email sent successfully',
        });

      } else {
        // Handle email sending error
        res.status(500).json({
          status: 'failure',
          message: 'Confirmation email not sent. Visit Contact center for Help',
        });
      }
    }
    else{
      res.status(200).json({
        status: 'success',
        message: 'Email already confirmed',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
      error: error.message,
    });
  }
};
