import  {Schema, model} from 'mongoose';
//import { validateEmail, validatePassword } from '../utils/validation';

const companySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a Company Name'],
  },
  contactName: {
    type: String,
    required: false,
  },
  officialEmail: {
    type: String,
    required: [true, 'Please provide a valid email address'],
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
  cacRegNo: {
    type: String,
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
  passwordToken: {
    type: String,
  },
  resetPasswordExpires: {
     type:  Date,
  }
});

export const Company = model('Company', companySchema);



