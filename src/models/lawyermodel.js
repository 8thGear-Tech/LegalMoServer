import  {Schema, model} from 'mongoose';


const lawyerSchema = new Schema({
   name: {
    type: String,
    // required: [true, 'Please provide a name'],
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  officialEmail: {
    type: String,
    // required: [true, 'Please provide a valid email address'],
    lowercase: true,
    unique: true,
  },
  googleId: {
    type: String,
    allowNull: true,
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
  lastDevice: {
    type: String
  },
  lastLocation: {
    type: String
  },
});

export const Lawyer = model('Lawyer', lawyerSchema);



