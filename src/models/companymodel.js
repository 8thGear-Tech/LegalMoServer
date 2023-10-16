import { Schema, model } from "mongoose";
//import { validateEmail, validatePassword } from '../utils/validation';
import mongoose from "mongoose";

const companySchema = new Schema({
  companyName: {
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
});

export const Company = model("Company", companySchema);
