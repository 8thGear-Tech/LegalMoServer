import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Admin } from "../models/adminmodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { Company } from "../models/companymodel.js";

// export async function passportSetup(userType) {
//   try {
//     // let User;
//       // Determine user type
//       const admin = await getAdmin({ officialEmail });
//       const company = await getCompany({ officialEmail });
//       const lawyer = await getLawyer({ officialEmail });

//       let User;
//       // let userType;

//       if (company) {
//         User = company;
//         userType = 'company';
//       } else if (admin) {
//         User = admin;
//         userType = 'admin';
//       } else if (lawyer) {
//         User = lawyer;
//         userType = 'lawyer';
//       } else {
//         return res.status(400).json({
//           status: 'fail',
//           message: 'Invalid email',
//         });
//       }

//     passport.use(
//       new GoogleStrategy(
//         {
//           clientID: process.env.GOOGLE_CLIENT_ID,
//           clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//           callbackURL: `/auth/google/redirect/${userType}`,
//         },
//         async function (accessToken, refreshToken, profile, done) {
//           // extract info from google profile
//           const { sub, name, picture, email } = profile._json;

//           // check if user already exists in our db with the given the email
//           let user = await User.findOne({ officialEmail: email});
//           if (user) {
//             return done(null, user);
//           }

//           // create an account for user with info from google profile
//           const content = {
//             name: name?.split(" ").join("").toLowerCase(),
//             officialEmail: email,
//             googleId: sub,
//             avatar: picture,
//             fullname: name,
//             isEmailConfirmed: true
//           };
//           user = new User(content);

//           await user.save();
//           return done(null, user);
//         }
//       )
//     );

//     passport.serializeUser((user, done) => {
//       done(null, user.id);
//     });

//     passport.deserializeUser((id, done) => {
//       User.findById(id).then((user) => {
//         done(null, user);
//       });
//     });

//     console.log(`Passport setup complete for ${userType}`);
//   } catch (error) {
//     console.log("Error setting up passport", error.message);
//   }
// }

// export const getAdmin = async (query) => {
//   return await Admin.findOne(query);
// };
// export const getCompany = async (query) => {
//   return await Company.findOne(query);
// };
// export const getLawyer = async (query) => {
//   return await Lawyer.findOne(query);
// };

export async function passportSetup(userType) {
  let User;
  switch (userType) {
    case "admin":
      User = Admin;
      break;
    case "company":
      User = Company;
      break;
    case "lawyer":
      User = Lawyer;
      break;
    default:
      throw new Error(`Invalid user type: ${userType}`);
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
        const existingUser =
          (await Admin.findOne({ officialEmail: email }).populate(
            "companies lawyers"
          )) ||
          (await Company.findOne({ officialEmail: email })) ||
          (await Lawyer.findOne({ officialEmail: email }));

        if (existingUser) {
          return done(null, existingUser);
        }

        // create an account for user with info from google profile
        const content = {
          name: name?.split(" ").join("").toLowerCase(),
          officialEmail: email,
          googleId: sub,
          avatar: picture,
          fullname: name,
          isEmailConfirmed: true,
        };
        const user = new User(content);

        if (userType === "admin") {
          await user.populate("companies lawyers");
        }

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
}
