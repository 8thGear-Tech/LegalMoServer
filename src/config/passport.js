import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Admin } from "../models/adminmodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { Company } from "../models/companymodel.js";

export function passportSetup(userType) {
  try {
    let User;
    // Determine which model to use based on the user type
    switch (userType) {
      case "admin":
        User = Admin;
        break;
      case "lawyer":
        User = Lawyer;
        break;
      case "company":
        User = Company;
        break;
      default:
        throw new Error("Invalid user type");
    }

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `/auth/google/redirect/${userType}`,
        },
        async function (accessToken, refreshToken, profile, done) {
          // extract info from google profile
          const { sub, name, picture, email } = profile._json;

          // check if user already exists in our db with the given the email
          let user = await User.findOne({ officialEmail: email });
          if (user) {
            return done(null, user);
          }

          // create an account for user with info from google profile
          const content = {
            name: name?.split(" ").join("").toLowerCase(),
            officialEmail: email,
            googleId: sub,
            avatar: picture,
            fullname: name,
          };
          user = new User(content);

          await user.save();
          return done(null, user);
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id).then((user) => {
        done(null, user);
      });
    });

    console.log(`Passport setup complete for ${userType}`);
  } catch (error) {
    console.log("Error setting up passport", error.message);
  }
}
