import  {Schema, model} from 'mongoose';
//import { validateEmail, validatePassword } from '../utils/validation';

const companySchema = new Schema({
  companyName: {
    type: String,
    required: [true, 'Please provide a Username'],
  },
  contactName: {
    type: String,
    required: [true, 'Please provide a Username'],
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
    required: [true, 'Please provide a contact phone number'],
  },
  officeAddress: {
    type: String,
    required: [true, 'Please confirm your official address'],
  },
  cac: {
    type: String,
  },
  industry: {
    type: String,
    required: [true, 'Please provide a valid industry'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
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



