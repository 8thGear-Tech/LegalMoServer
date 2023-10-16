// import express from "express";
// import passport from "passport";
// import { passportSetup } from "../config/passport.js";
// import {routeBasedOnUserType} from "../controllers/middleware.js";

// const router = express.Router();

// router.get('/auth/google/:userType',
//   (req, res, next) => {
//     // Set the userType based on the route parameter or query parameter
//     const userType = req.params.userType;

//     if (userType) {
//       // Use the userType to set up Passport
//       passportSetup(userType);

//       passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);

//     } else {
//       // Handle the case where userType is not provided
//       res.status(400).send('User type is required.');
//     }
//   }
// );

// router.get('/auth/google/redirect/:userType',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   routeBasedOnUserType
// );

// // router.get("/google/redirect", passport.authenticate("google"), user.login);

// export default router;
