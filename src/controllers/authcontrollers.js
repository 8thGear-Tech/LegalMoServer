import { Company } from '../models/companymodel.js';
import { Lawyer } from '../models/lawyermodel.js';
import { Admin } from '../models/adminmodel.js';
import { adminRegister, companyRegister, lawyerRegister, options } from '../utils/validator.js';
import bcrypt from 'bcryptjs'
import dotenv from "dotenv";
import { generateToken, emailConfirmationToken, passwordMatch, sendConfirmationEmail, 
  checkInternetConnection } from '../utils/utils.js';
import { sendEmail } from '../utils/email.js';
import { doesUserExist } from '../utils/utils.js';
import useragent from 'useragent';
import axios from 'axios';

dotenv.config ({ path: "./configenv.env" });

export const adminSignup = async (req, res) => {
  try {
    // Check if the user is connected to the internet
    await checkInternetConnection();

    const validate = adminRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    // Check if admin exists
      const officialEmail = req.body.officialEmail;
      if (await doesUserExist(officialEmail)) {
        return res.status(409).json({
          status: 'fail',
          message: 'User with that email already exists',
        });
      } else {
      // Check if password and passwordConfirm are the same
      const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
      if (!passwordCheck) {
        return res.status(400).json({
          status: 'fail',
          message: 'Passwords do not match',
        });
      }

      // Hash password and create new admin
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      const newAdmin = new Admin({
        name: req.body.name,
        officialEmail: req.body.officialEmail,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
      });

      // Save new admin to the database
      await newAdmin.save();
      const { _id } = newAdmin;
      const userType = 'admin';
      const token = emailConfirmationToken(_id, userType);


      // Send the Confirmation Email to Admin
      const emailSent = await sendConfirmationEmail(
        newAdmin.officialEmail, 
        token,
        newAdmin.name
      );

      if (emailSent) {
        res.status(201).json({
          status: 'success',
          message: 'Confirmation email sent successfully',
          data: {
            admin: newAdmin,
          },
        });
      } else {
        // Handle email sending error
        res.status(500).json({
          status: 'failure',
          message: 'Confirmation email not sent. Visit Contact center for Help',
        });
      }
    }
  } catch (error) {
    if (error.message === 'No internet connection') {
      return res.status(503).json({
        status: 'fail',
        message: 'No internet connection',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
      error: error.message,
    });
  }
};
export const companySignup = async (req, res) => {
  try {
    // Check if the user is connected to the internet
    await checkInternetConnection();
    // Validate company inputs
    const validate = companyRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({ 
        status: 'fail',
        message,
      });
    }

    // Check if company exists
    const officialEmail = req.body.officialEmail;
    if (await doesUserExist(officialEmail)) {
      return res.status(409).json({
        status: 'fail',
        message: 'User with that email already exists',
      });
    }

    // Check if password and passwordConfirm are the same
    const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
    if (!passwordCheck) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match',
      });
    }

    // Hash password and create a new company
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newCompany = new Company({
      name: req.body.name,
      contactName: req.body.contactName,
      officialEmail: req.body.officialEmail,
      phoneNumber: req.body.phoneNumber,
      officeAddress: req.body.officeAddress,
      cacRegNo: req.body.cacRegNo,
      industry: req.body.industry,
      password: hashedPassword,
    });

    await newCompany.save();

       // Find all admins and add the new company to their companies array
      const admins = await Admin.find({});
      for (let admin of admins) {
      admin.companies.push(newCompany._id);
      await admin.save();
    }

    const { _id } = newCompany;
    const userType = 'company';
    const token = emailConfirmationToken(_id, userType);

        // Send the Confirmation Email to Company
       const emailSent = await sendConfirmationEmail(newCompany.officialEmail, token, newCompany.name);
 
       if (emailSent) {
         res.status(201).json({
          status: 'success',
          message: 'Confirmation email sent successfully',
          data: {
            company: newCompany,
            youtoken: token,
          },
         });
       } else {
         // Handle email sending error
         res.status(500).json({
           status: 'failure',
           message: 'Confirmation email not sent. Visit Contact center for Help',
         });
       }
  } catch (error) {
    if (error.message === 'No internet connection') {
      return res.status(503).json({
        status: 'fail',
        message: 'No internet connection',
      });
    }

    res.status(500).json({ 
      status: 'fail',
      message: error.message,
    });
  }
};
export const lawyerSignup = async (req, res) => {
  try {
    // Check if the user is connected to the internet
    await checkInternetConnection();
   
    // Validate lawyer inputs
    const validate = lawyerRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({ 
        status: 'fail',
        message,
      });
    }
  
    // Check if lawyer exists
    const officialEmail = req.body.officialEmail;
    if (await doesUserExist(officialEmail)) {
      return res.status(409).json({
        status: 'fail',
        message: 'User with that email already exists',
      });
    }

    // Check if password and passwordConfirm are the same
    const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
    if (!passwordCheck) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'Passwords do not match',
      });
    }
    // Hash password and create new lawyer
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newLawyer = new Lawyer({
      name: req.body.name,
      officialEmail: req.body.officialEmail,
      phoneNumber: req.body.phoneNumber,
      password: hashedPassword,
      areasOfPractise: req.body.areasOfPractise,
      scn: req.body.scn,
      cacAccNo: req.body.cacAccNo,
      lawFirmAddress: req.body.lawFirmAddress,
      lawFirmName: req.body.lawFirmName,
    });

    await newLawyer.save();

        // Find all admins and add the new lawyer to their lawyers array
        const admins = await Admin.find({});
        for (let admin of admins) {
        admin.lawyers.push(newLawyer._id);
        await admin.save();
      }

    const { _id } = newLawyer;
    const userType = 'lawyer';
    const token = emailConfirmationToken(_id, userType);

    // Send the Confirmation Email to Lawyer
        const emailSent = await sendConfirmationEmail(newLawyer.officialEmail, token, newLawyer.name);
 
        if (emailSent) {
          res.status(201).json({
           status: 'success',
           message: 'Confirmation email sent successfully',
           data: {
              lawyer: newLawyer,
           },
          });
        } else {
          res.status(500).json({
            status: 'failure',
            message: 'Confirmation email not sent. Visit Contact center for Help',
          });
        }
  } catch (error) {
    if (error.message === 'No internet connection') {
      return res.status(503).json({
        status: 'fail',
        message: 'No internet connection',
      });
    }

    res.status(500).json({ 
      status: 'fail',
      message: 'Internal server error',
    });
  }
};
async function handleGoogleLogin(req, res, user) {
try {
        // Check if the user is connected to the internet
        await checkInternetConnection();
        // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
        const _id = user.id;
        const userType = user.userType;
        const token = generateToken(_id, userType);

        // Check if the user is logging in from a new device
        const agent = useragent.parse(req.headers['user-agent']);
        const osName = agent.os.family;
        const deviceVendor = agent.family;
        const deviceModel = agent.major;
        const device = `${osName} ${deviceVendor} ${deviceModel}`;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        // Get the device's location
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const location = response.data;

        // Check if the location was successfully determined
        let locationString;
        if (location.status === 'fail') {
          locationString = 'Unknown';
          } else {
            // Convert the location to a string
            locationString = `${location.city}, ${location.country}`;
          }

          if (user.lastDevice !== device || user.lastLocation !== locationString) {
            // Send email to the user
              await sendEmail({
                email: user.officialEmail,
                subject: "New Login Notification",
                html: `<p>A new login was detected for your account.</p>
                  <p>Device: ${device}</p>
                  <p>Location: ${locationString}</p>`,
              });
              // Update the user's last device and IP
              user.lastDevice = device;
              user.lastLocation = locationString;
              await user.save();
          }

          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1; // Add 1 because getMonth() is zero-based
          const date = now.getDate();
      
          req.headers.authorization = `Bearer ${token}`;
          res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).status(200).json({
          status: 'success',
          token,
          createdAt: `${date}/${month}/${year}`, 
          data: { user },
          });

    } catch (error) {
        if (error.message === 'No internet connection') {
          return res.status(503).json({
            status: 'fail',
            message: 'No internet connection',
          });
        }

  // Handle other errors
  res.status(500).json({
    status: 'fail',
    message: error.message,
  }); 
}
};
export const usersLogin = async (req, res) => {
  try {
    // Check if the user is connected to the internet
    await checkInternetConnection();
    // Handle Google SignIn
    if (req.url.startsWith("/auth/google/redirect/company?code=") || req.url.startsWith("/auth/google/redirect/lawyer?code=") || req.url.startsWith("/auth/google/redirect/admin?code=")) {
      const user = req.user
     return await handleGoogleLogin(req, res, user);
    }
    // Manual Login
    const { officialEmail, password } = req.body;

    if (!officialEmail || !password) {
      return res.status(400).json({  
        status: 'fail',
        message: 'Please provide email and password',
      });
    } 

    // Determine user type
    const admin = await getAdmin({ officialEmail });
    const company = await getCompany({ officialEmail });
    const lawyer = await getLawyer({ officialEmail });
     
    let user;
    let userType;

    if (company) {
      user = company;
      userType = 'company';
    } else if (admin) {
      user = admin;
      userType = 'admin';
    } else if (lawyer) {
      user = lawyer;
      userType = 'lawyer';
    } else {
      return res.status(400).json({  
        status: 'fail',
        message: 'Invalid email',
      });
    }

    if (!user.password) {
      return res.status(403).send('Invalid login route. Use SSO');
    }
    // Verify password
    const passwordIsValid = await bcrypt.compare(password, user.password || "");

    if (passwordIsValid) {
      // Check if the user's email is confirmed
       if (!user.isEmailConfirmed) {
         return res.status(403).json({ 
           status: 'fail',
           message: 'Please confirm your email address to log in.',
         });
       }

           // Check if the user is logging in from a new device
           const agent = useragent.parse(req.headers['user-agent']);
           const osName = agent.os.family;
           const deviceVendor = agent.family;
           const deviceModel = agent.major;
           const device = `${osName} ${deviceVendor} ${deviceModel}`;
           const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            // Get the device's location
            const response = await axios.get(`http://ip-api.com/json/${ip}`);
            const location = response.data;
     
                  // Check if the location was successfully determined
                  if (location.status === 'fail') {
                    const locationString = 'Unknown';
                    // console.log('Failed to determine location:', location.message); 
                    if (user.lastDevice !== device || user.lastLocation !== locationString) {
                      // Send email to the user
                      await sendEmail({
                       email: user.officialEmail,
                       subject: "New Login Notification",
                       html: `<p>A new login was detected for your account.</p>
                         <p><b>Device</b>: ${device}</p>
                         <p><b>Location</b>: ${locationString}</p>
                         <p><b>If you did not initiate the login or does not recognise the devie please contact support centre.</b></p>`,
                     });
                      // Update the user's last device and IP
                      user.lastDevice = device;
                      user.lastLocation = locationString;
                      await user.save();
                    }
                  } else {
                    // Convert the location to a string
                    const locationString = `${location.city}, ${location.country}`;
                    // console.log("location is", locationString);
  
                    if (user.lastDevice !== device || user.lastLocation !== locationString) {
                      // Send email to the user
                      await sendEmail({
                       email: user.officialEmail,
                       subject: "New Login Notification",
                       html: `<p>A new login was detected for your account.</p>
                         <p>Device: ${device}</p>
                         <p>Location: ${locationString}</p>
                         <p>If you didnt initiate the login or does not recognise the devie please contact support centre</p>`,
                     });
                      // Update the user's last device and IP
                        user.lastDevice = device;
                        user.lastLocation = locationString;
                        await user.save();
                    }
                  }
       // Generate token and set cookie with token to be sent to the client and kept for 30 days
      //  console.log(userType)
       const _id = user.id;
       const token = generateToken( _id, userType);
       req.headers.authorization = `Bearer ${token}`;

      // Send response
      res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).status(200).json({
        status: 'success',
        token,
        data: { user },
      });
    } else {
      return res.status(401).json({ 
        status: 'fail',
        message: 'Invalid email/password',
      });
    }
  } catch (error) {
    console.log(error)
    if (error.message === 'No internet connection') {
    return res.status(503).json({  
      status: 'fail',
      message: 'No internet connection'
    });
  }

  res.status(500).json({ 
    status: 'fail',
    message: 'Internal server error',
  });
};
};
export const logoutUser = async (req, res) => {
  try {
    // Check if the user is connected to the internet
    await checkInternetConnection();
    // Clear the JWT token by setting an expired token
    res.cookie('jwt', 'expired', { httpOnly: true, maxAge: 1 });
    // Redirect the user to the login page or any other page you prefer
    res.status(200).send("user logged out successfully from server");
  } catch (error) {
    if (error.message === 'No internet connection') {
      return res.status(503).json({
        status: 'fail',
        message: 'No internet connection',
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getAdmin = async (query) => {
  return await Admin.findOne(query);
};
export const getCompany = async (query) => {
  return await Company.findOne(query);
};
export const getLawyer = async (query) => {
  return await Lawyer.findOne(query);
};

