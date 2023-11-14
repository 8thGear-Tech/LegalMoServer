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
  lastDevice: {
    type: String
  },
  lastLocation: {
    type: String
  },
  userType: {
    type: String,
    default: 'lawyer',
  },
});

export const Lawyer = model('Lawyer', lawyerSchema);



