import  {Schema, model} from 'mongoose';

const adminSchema = new Schema({
    name: {
    type: String,
    required: [true, 'Please provide a Username'],
  },
   phoneNumber: {
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
  googleId: {
    type: String,
    allowNull: true,
  },
  password: {
    type: String,
    required: false,
  },
  companies: [{
    type: Schema.Types.ObjectId,
    ref: 'Company', // Reference to the Company model
}],
  lawyers: [{
    type: Schema.Types.ObjectId,
    ref: 'Lawyer', // Reference to the Lawyer model
}],
   jobs: {
    type: [String],
  },
  passwordToken: {
    type: String
  },
  resetPasswordExpires: {
    type:  Date
  },
  lastDevice: {
    type: String
  },
  lastLocation: {
    type: String
  },
  userType: {
    type: String,
    default: 'admin',
  },
});

export const Admin = model('Admin', adminSchema);

