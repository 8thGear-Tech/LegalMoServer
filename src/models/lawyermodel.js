import { Schema, model } from "mongoose";
//import { validateEmail, validatePassword } from '../utils/validation';
import mongoose from "mongoose";

const lawyerSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  officialEmail: {
    type: String,
    required: [true, "Please provide a valid email address"],
    lowercase: true,
    unique: true,
  },
  googleId: {
    type: String,
    allowNull: true,
  },
  profileImage: {
    public_id: {
      type: String,
      default: 'profileImage',
    },
    url: {
      type: String,
      default: 'https://res.cloudinary.com/drlfylzhf/image/upload/v1700055556/cld-sample.jpg',
    }
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  lawFirmName: {
    type: String,
  },
  lawFirmAddress: {
    type: String,
  },
  scn: {
    type: String,
    required: false,
  },
  cacAccNo: {
    type: String,
  },
  password: {
    type: String,
    required: false,
  },
  areasOfPractise: {
    type: [String],
    enum : {
      values: ['Maritime', 'International Trade and Investment', 'Tax Practise', 'Aviation and Space', 'Sports', 'Entertainment', 'Technology'],
      message: '{VALUE} is not supported'
    },
    required: false,
  },
  yourBio: {
    type: String,
  },
  yearOfCall: {
    type: String,
  },
  alternativeEmailAddress: {
    type: String,
  },
  passwordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  job: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  updateOTP: {
    type: String,
  },
  accountDetails: [
    {
      accountNumber: {
        type: String,
      },
      accountName: {
        type: String,
      },
      bank: {
        type: String,
      },
    },
  ],
  lastDevice: {
    type: String,
  },
  lastLocation: {
    type: String,
  },
  userType: {
    type: String,
    default: "lawyer",
  },
  admin:{
    type: Schema.Types.ObjectId,
    ref: 'Admin', 
  },
}, 
{ timestamps: true }
);

export const Lawyer = model("Lawyer", lawyerSchema);
