import { Schema, model } from "mongoose";
//import { validateEmail, validatePassword } from '../utils/validation';
import mongoose from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a Company Name"],
    },
    contactName: {
      type: String,
      required: false,
    },
    officialEmail: {
      type: String,
      required: [true, "Please provide a valid email address"],
      lowercase: true,
      unique: true,
    },
    profileImage: {
      public_id: {
        type: String,
        default: "profileImage",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/ds8byyltz/image/upload/v1703242828/default-logo_x1rmai.webp",
        // "https://res.cloudinary.com/drlfylzhf/image/upload/v1700055556/cld-sample.jpg",
      },
    },
    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    officeAddress: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      allowNull: true,
    },
    cac: {
      type: String,
      required: false,
    },
    industry: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    website: {
      type: String,
    },
    yourBio: {
      type: String,
    },
    alternativeEmailAddress: {
      type: String,
    },
    purchase: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    passwordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    lastDevice: {
      type: String,
    },
    lastLocation: {
      type: String,
    },
    userType: {
      type: String,
      default: "company",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export const Company = model("Company", companySchema);
