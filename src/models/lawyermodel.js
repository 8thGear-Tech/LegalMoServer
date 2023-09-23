import  {Schema, model} from 'mongoose';
//import { validateEmail, validatePassword } from '../utils/validation';

const lawyerSchema = new Schema({
   name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a contact phone number'],
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
  lawFirmName: {
    type: String,
  },
  lawFirmAddress: {
    type: String,
  },
  scn: {
    type: String,
    required: [true, 'Please provide your Supreme Court Enrolment Number'],
  },
  cac: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  areasOfPractise: {
    type: [String],
    required: [true, 'Please provide your areas of practise'],
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
  }
});

export const Lawyer = model('Lawyer', lawyerSchema);



