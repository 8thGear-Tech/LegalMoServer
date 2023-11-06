import { Company } from "../models/companymodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { Admin } from "../models/adminmodel.js";
import {
  adminRegister,
  companyRegister,
  lawyerRegister,
  options,
} from "../utils/validator.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import {
  generateToken,
  emailConfirmationToken,
  passwordMatch,
  sendConfirmationEmail,
} from "../utils/utils.js";
import { sendEmail } from "../utils/email.js";
import useragent from "useragent";
import axios from "axios";

dotenv.config({ path: "./configenv.env" });

export const adminSignup = async (req, res) => {
  try {
    const validate = adminRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({
      officialEmail: req.body.officialEmail,
    });
    if (existingAdmin) {
      const message = "User with that email already exists";
      return res.status(409).json({
        status: "fail",
        message,
      });
    } else {
      // Check if password and passwordConfirm are the same
      const passwordCheck = passwordMatch(
        req.body.password,
        req.body.passwordConfirm
      );
      if (!passwordCheck) {
        return res.status(400).json({
          status: "fail",
          message: "Passwords do not match",
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
      const userType = "admin";
      const token = emailConfirmationToken(_id, userType);

      // Send the Confirmation Email to Admin
      const emailSent = await sendConfirmationEmail(
        newAdmin.officialEmail,
        token
      );

      if (emailSent) {
        res.status(201).json({
          status: "success",
          message: "Confirmation email sent successfully",
          data: {
            admin: newAdmin,
          },
        });
      } else {
        // Handle email sending error
        res.status(500).json({
          status: "failure",
          message: "Confirmation email not sent. Visit Contact center for Help",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
// export const adminLogin = async (officialEmail, password) => {
//   try {
//     // handle google SignIn
//     if (req.url.startsWith("/auth/google/redirect/admin?code=")) {
//       // return res.send(`You have Signed in with Google`);
//       const user = req.user
//          // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
//               const { _id } = user.id;
//               const token = generateToken(_id);
//               res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
//             return res.status(200).json({
//               status: 'success',
//               data: { user },
//             });
//         }

//           const { officialEmail, password } = req.body;

//           // Check if admin exists
//           const admin = await Admin.findOne({ officialEmail });
//           if (!admin) {
//             return res.status(404).json({
//               status: 'fail',
//               message: 'You are not an admin',
//             });
//           }
//         // Check if the password is correct and log in the admin
//         const passwordCheck = await bcrypt.compare(password, admin?.password || "");

//         if (passwordCheck) {
//                     // Check if the admin's email is confirmed
//             if (!admin.isEmailConfirmed) {
//               return res.status(400).json({
//                 status: 'fail',
//                 message: 'Please confirm your email address to log in.',
//               });
//             }

//             // Get user agent and IP information
//               const device = useragent.parse(req.headers["user-agent"]);
//               const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//               const location = geoip.lookup(ip);

//               // Check if user's device or location has changed
//               const previousDevice = admin.device || "";
//               const previousLocation = admin.location || "";

//               if (previousDevice !== device.source || previousLocation !== location) {
//                 // Send email notification about login attempt from different device, IP, or location
//                 await sendEmail({
//                   email: admin.officialEmail,
//                   subject: "New Login Notification",
//                   html: `<p>A new login was detected for your account.</p>
//                     <p>Device: ${device.source}</p>
//                     <p>Location: ${location}</p>`,
//                 });
//               }

//             // Update user information with current device and location details
//             admin.device = device.source;
//             admin.location = location
//                 ? `${location.country}, ${location.city}`
//                 : "Unknown";;
//             await admin.save();

//             console.log(location)

//             const { _id } = admin;
//             const token = generateToken(_id);
//             res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });

//             return res.status(200).json({
//               status: 'success',
//               data: { admin },
//             });
//         }
//     return res.status(401).json({
//       status: 'fail',
//       message: 'Invalid email/password',
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 'fail',
//       message: error.message,
//     });
//   }
// };
export const companySignup = async (req, res) => {
  try {
    // Validate company inputs
    const validate = companyRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    // Check if company exists
    const existingCompany = await Company.findOne({
      officialEmail: req.body.officialEmail,
    });
    if (existingCompany) {
      return res.status(409).json({
        status: "fail",
        message: "Company with that email already exists",
      });
    }

    // Check if password and passwordConfirm are the same
    const passwordCheck = passwordMatch(
      req.body.password,
      req.body.passwordConfirm
    );
    if (!passwordCheck) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }

    // Hash password and create a new company
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newCompany = new Company({
      companyName: req.body.companyName,
      contactName: req.body.contactName,
      officialEmail: req.body.officialEmail,
      phoneNumber: req.body.phoneNumber,
      officeAddress: req.body.officeAddress,
      cac: req.body.cac,
      industry: req.body.industry,
      password: hashedPassword,
    });

    await newCompany.save();
    const { _id } = newCompany;
    const userType = "company";
    const token = emailConfirmationToken(_id, userType);

    // Send the Confirmation Email to Company
    const emailSent = await sendConfirmationEmail(
      newCompany.officialEmail,
      token
    );

    if (emailSent) {
      res.status(201).json({
        status: "success",
        message: "Confirmation email sent successfully",
        data: {
          company: newCompany,
          youtoken: token,
        },
      });
    } else {
      // Handle email sending error
      res.status(500).json({
        status: "failure",
        message: "Confirmation email not sent. Visit Contact center for Help",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

//     // const { officialEmail, password } = req.body;

//     // Check if company exists
//     const company = await Company.findOne({ officialEmail });
//     if (!company) {
//       return { status: 401, success: false,  message: 'You are not a registered company here', }
//     }
//      // Return { success: false } if unsuccessful
//   // Return { success: true, data: companyData } if successful

//       // Check if password is correct and then if the email is verified. Proceed to login company if both conditions are met
//       const passwordCheck = await bcrypt.compare(password, company?.password || "");
//       if (passwordCheck) {
//         // Check if the company's email is confirmed
//           if (!company.isEmailConfirmed) {
//             return { status: 403, success: false, message: 'Please confirm your email address to log in.' }
//           }

//            // Generate token and set cookie with token to be sent to the client and kept for 30 days
//             const { _id } = company;
//             const token = generateToken(_id);
//             res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
//             console.log(token)

//         return { status: 200, success: true, data: { company } }
//       }

//     // return res.status(401).json({
//     //   status: 'fail',
//     //   message: 'Invalid email/password',
//     // });

//   // } catch (error) {
//   //   res.status(500).json({
//   //     status: 'fail',
//   //     message: 'Internal server error',
//   //   });
//   // }
// };
// export const companyLogin = async (officialEmail, password, res) => {
//   try {
//     // Check if company exists
//     const company = await Company.findOne({ officialEmail });

//     if (!company) {
//       return { status: 401, success: false, message: 'You are not a registered company here' };
//     }

//     // Check if password is correct and then if the email is verified. Proceed to log in the company if both conditions are met
//     const passwordCheck = await bcrypt.compare(password, company?.password || '');

//     if (passwordCheck) {
//       // Check if the company's email is confirmed
//       if (!company.isEmailConfirmed) {
//         return { status: 403, success: false, message: 'Please confirm your email address to log in.' };
//       }

//       // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
//       const { _id } = company;
//       const token = generateToken(_id);
//       // You cannot set a cookie here directly as 'res' is not available. Instead, you can return the token.
//       return { status: 200, success: true, data: { company, token } };
//     } else {
//       return { status: 401, success: false, message: 'Invalid email/password' };
//     }
//   } catch (error) {
//     // Handle any errors here
//     return { status: 500, success: false, message: 'Internal server error' };
//   }
// };
export const lawyerSignup = async (req, res) => {
  try {
    // Validate lawyer inputs
    const validate = lawyerRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    // Check if lawyer exists
    const existingLawyer = await Lawyer.findOne({
      officialEmail: req.body.officialEmail,
    });
    if (existingLawyer) {
      return res.status(409).json({
        status: "fail",
        message: "Lawyer with that email already exists",
      });
    }

    // Check if password and passwordConfirm are the same
    const passwordCheck = passwordMatch(
      req.body.password,
      req.body.passwordConfirm
    );
    if (!passwordCheck) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }
    // Hash password and create new lawyer
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newLawyer = new Lawyer({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      officialEmail: req.body.officialEmail,
      lawFirmName: req.body.lawFirmName,
      lawFirmAddress: req.body.lawFirmAddress,
      scn: req.body.scn,
      cac: req.body.cac,
      lawFirmAddress: req.body.lawFirmAddress,
      lawFirmName: req.body.lawFirmName,
      password: hashedPassword,
    });

    await newLawyer.save();
    const { _id } = newLawyer;
    const userType = "lawyer";
    const token = emailConfirmationToken(_id, userType);
    // console.log(token, "token expires in" + expiresIn)

    // Send the Confirmation Email to Lawyer
    const emailSent = await sendConfirmationEmail(
      newLawyer.officialEmail,
      token
    );

    if (emailSent) {
      res.status(201).json({
        status: "success",
        message: "Confirmation email sent successfully",
        data: {
          lawyer: newLawyer,
          token,
          userType: newLawyer.userType,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Confirmation email not sent. Visit Contact center for Help",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
// export const lawyerLogin = async (req, res) => {
//   try {
//     // handle google SignIn
//     if (req.url.startsWith("/auth/google/redirect/lawyer?code=")) {
//       // return res.send(`You have Signed in with Google`);
//       const user = req.user
//          // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
//               const { _id } = user.id;
//               const token = generateToken(_id);

//               console.log(token)
//               res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });

//           return res.status(200).json({
//             status: 'success',
//             data: { user },
//           });
//     }

//     const { officialEmail, password } = req.body;

//     // Check if lawyer exists
//     const lawyer = await Lawyer.findOne({ officialEmail });

//     if (!lawyer) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'You are not a registered lawyer here',
//       });
//     }

//       // Check if password is correct and log in lawyer
//       const passwordCheck = await bcrypt.compare(password, lawyer.password || '');

//       if (passwordCheck) {
//            // Check if the lawyer's email is confirmed
//             if (!lawyer.isEmailConfirmed) {
//               return res.status(403).json({
//                 status: 'fail',
//                 message: 'Please confirm your email address to log in.',
//               });
//             }

//             // Generate token and set cookie with token to be sent to the client and kept for 30 days
//             const { _id } = lawyer;
//             const token = generateToken(_id);
//             // console.log(token)
//             res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

//         return res.status(200).json({
//           status: 'success',
//           data: { lawyer },
//         });
//       }

//     return res.status(401).json({
//       status: 'fail',
//       message: 'Invalid email/password',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 'fail',
//       message: 'Internal server error',
//     });
//   }
// };
export const getAdmin = async (query) => {
  return await Admin.findOne(query);
};
export const getCompany = async (query) => {
  return await Company.findOne(query);
};
export const getLawyer = async (query) => {
  return await Lawyer.findOne(query);
};
export const usersLogin = async (req, res) => {
  try {
    // Handle Google SignIn
    if (
      req.url.startsWith("/auth/google/redirect/company?code=") ||
      req.url.startsWith("/auth/google/redirect/lawyer?code=") ||
      req.url.startsWith("/auth/google/redirect/admin?code=")
    ) {
      const user = req.user;
      // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
      const { _id } = user.id;
      const token = generateToken(_id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      // Check if the user is logging in from a new device
      const agent = useragent.parse(req.headers["user-agent"]);
      const osName = agent.os.family;
      const deviceVendor = agent.family;
      const deviceModel = agent.major;
      const device = `${osName} ${deviceVendor} ${deviceModel}`;
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      // Get the device's location
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      const location = response.data;

      // Check if the location was successfully determined
      if (location.status === "fail") {
        const locationString = "Unknown";
        // console.log('Failed to determine location:', location.message);
        if (
          user.lastDevice !== device ||
          user.lastLocation !== locationString
        ) {
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
      } else {
        // Convert the location to a string
        const locationString = `${location.city}, ${location.country}`;
        // console.log("location is", locationString);

        if (
          user.lastDevice !== device ||
          user.lastLocation !== locationString
        ) {
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
      }

      return res.status(200).json({
        status: "success",
        data: { user },
      });
    }
    // Mamual Login
    const { officialEmail, password } = req.body;
    // console.log("officialEmail:", officialEmail, "password:", password);

    if (!officialEmail || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    // Determine user type
    const admin = await getAdmin({ officialEmail });
    const company = await getCompany({ officialEmail });
    const lawyer = await getLawyer({ officialEmail });
    // console.log("Lawyer from database:", lawyer);

    let user;
    let userType;

    if (company) {
      user = company;
      userType = "company";
    } else if (admin) {
      user = admin;
      userType = "admin";
    } else if (lawyer) {
      user = lawyer;
      userType = "lawyer";
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email",
      });
    }

    if (!user.password) {
      return res.status(403).send("Invalid login route. Use SSO");
    }
    // Verify password
    const passwordIsValid = await bcrypt.compare(password, user.password || "");

    if (passwordIsValid) {
      // Check if the user's email is confirmed
      if (!user.isEmailConfirmed) {
        return res.status(403).json({
          status: "fail",
          message: "Please confirm your email address to log in.",
        });
      }

      // Check if the user is logging in from a new device
      const agent = useragent.parse(req.headers["user-agent"]);
      const osName = agent.os.family;
      const deviceVendor = agent.family;
      const deviceModel = agent.major;
      const device = `${osName} ${deviceVendor} ${deviceModel}`;
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      console.log("device is", device);

      // Get the device's location
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      const location = response.data;

      // Check if the location was successfully determined
      if (location.status === "fail") {
        const locationString = "Unknown";
        // console.log('Failed to determine location:', location.message);
        if (
          user.lastDevice !== device ||
          user.lastLocation !== locationString
        ) {
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
      } else {
        // Convert the location to a string
        const locationString = `${location.city}, ${location.country}`;
        // console.log("location is", locationString);

        if (
          user.lastDevice !== device ||
          user.lastLocation !== locationString
        ) {
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
      const { _id } = user;
      const token = generateToken(_id);
      // console.log(token)
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      // Send response
      res.status(200).json({
        status: "success",
        token,
        userType,
        data: { user },
      });
    } else {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email/password",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
export const logoutUser = async (req, res) => {
  try {
    // Clear the JWT token by setting an expired token
    res.cookie("jwt", "expired", { httpOnly: true, maxAge: 1 });
    // Redirect the user to the login page or any other page you prefer
    res.status(200).send("user logged out successfully from server");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
