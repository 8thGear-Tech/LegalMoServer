import jwt from "jsonwebtoken";
import {
  getOneAdmin,
  getOneCompany,
  getOneLawyer,
  adminProfileUpdate,
  companyProfileUpdate,
  lawyerProfileUpdate,
} from "./usersControllers.js";
import { checkInternetConnection } from "../utils/utils.js";

const jwtsecret = process.env.JWT_SECRET;
export const authenticateUser = async (req, res, next) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;
    // const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    console.log("Token:", token);

    if (!token) {
      console.log("No Token");
      return res.status(401).json({ message: "Unidentified user" });
    }

    const decoded = jwt.verify(token, jwtsecret);
    console.log("Decoded Token:", decoded);

    req.userId = decoded.id;
    req.userType = decoded.userType;

    next();
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(401).json({ message: "You are not authorized" });
  }
};
export const isAdminUser = async (req, res, next) => {
  // Check if the user is connected to the internet
  await checkInternetConnection();

  // Get the token from the request headers
  const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

  // Verify and decode the token
  const decodedToken = jwt.verify(token, jwtsecret);

  // Get the user type from the decoded token
  const { userType } = decodedToken;

  if (userType === "admin") {
    // User is an admin, allow access to the endpoint
    next();
  } else {
    // User is not an admin, respond with an unauthorized status code
    res
      .status(403)
      .json({ message: "Access denied. Admin permissions required." });
  }
};
export const routeBasedOnUserType = async (req, res, next) => {
  try {
    // Check if the user is connected to the internet
    await checkInternetConnection();

    const { userType } = req.params;

    if (!userType || !["company", "admin", "lawyer"].includes(userType)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user type",
      });
    }

    // Based on the user type, route the request to the appropriate login function
    switch (userType) {
      case "company":
        return companyLogin(req, res, next);
      case "admin":
        return adminLogin(req, res, next);
      case "lawyer":
        return lawyerLogin(req, res, next);
      default:
        return res.status(400).json({
          status: "fail",
          message: "Invalid user type",
        });
    }
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(401).json({ message: "You are not authorized" });
  }
};

export const profileBasedOnUserType = async (req, res, next) => {
  try {
    // Check if the user is connected to the internet
    await checkInternetConnection();

    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

    // Verify and decode the token
    const decodedToken = jwt.verify(token, jwtsecret);

    // Get the user type from the decoded token
    const { userType } = decodedToken;

    // Check if the user type is valid
    if (!userType || !["company", "admin", "lawyer"].includes(userType)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user type",
      });
    }
    // Based on the user type, route the request to the appropriate profile function
    switch (userType) {
      case "company":
        return getOneCompany(req, res, next);
      case "admin":
        return getOneAdmin(req, res, next);
      case "lawyer":
        return getOneLawyer(req, res, next);
      default:
        return res.status(400).json({
          status: "fail",
          message: "Invalid user type",
        });
    }
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    // If the token  is not valid, return an error
    res.status(401).json({
      status: "fail",
      message: "Invalid token. Failed to verify userType",
    });
  }
};
export const updateProfileBasedOnUser = async (req, res, next) => {
  try {
    // Check if the user is connected to the internet
    await checkInternetConnection();

    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

    // Verify and decode the token
    const decodedToken = jwt.verify(token, jwtsecret);

    // Get the user type from the decoded token
    const { userType } = decodedToken;

    // Check if the user type is valid
    if (!userType || !["company", "admin", "lawyer"].includes(userType)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user type",
      });
    }

    // Based on the user type, route the request to the appropriate update function
    switch (userType) {
      case "admin":
        return adminProfileUpdate(req, res, next);
      case "company":
        return companyProfileUpdate(req, res, next);
      case "lawyer":
        return lawyerProfileUpdate(req, res, next);
      default:
        return res.status(400).json({
          status: "fail",
          message: "Invalid user type",
        });
    }
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    // If the token is not valid, return an error
    res.status(401).json({
      status: "fail",
      message: "Invalid token. Failed to verify userType",
    });
  }
};
