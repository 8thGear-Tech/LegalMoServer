import  {Schema, model} from 'mongoose';

const companySchema = new Schema({
  name: {
    type: String,
    // required: [true, 'Please provide a Company Name'],
  },
  contactName: {
    type: String,
    required: false,
  },
  officialEmail: {
    type: String,
    // required: [true, 'Please provide a valid email address'],
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
  },
  lastDevice: {
    type: String,
  },
  lastLocation: {
    type: String,
  },
});

export const Company = model('Company', companySchema);



