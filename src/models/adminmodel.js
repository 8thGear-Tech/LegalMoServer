import  {Schema, model} from 'mongoose';
//import { validateEmail, validatePassword } from '../utils/validation';

const adminSchema = new Schema({
    name: {
    type: String,
    required: [true, 'Please provide a Username'],
  },
   phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
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
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  companies: {
    type: [String],
  },
  lawyers: {
    type: [String],
  },
   jobs: {
    type: [String],
  },
  passwordToken: {
    type: String
  },
  resetPasswordExpires: {
    type:  Date
  }
});

export const Admin = model('Admin', adminSchema);

