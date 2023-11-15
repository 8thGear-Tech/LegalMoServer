import  {Schema, model} from 'mongoose';

const companySchema = new Schema({
  name: {
    type: String,
  },
  contactName: {
    type: String,
    required: false,
  },
  officialEmail: {
    type: String,
    lowercase: true,
    unique: true,
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
  userType: {
    type: String,
    default: 'company',
  },
  admin:{
    type: Schema.Types.ObjectId,
    ref: 'Admin', 
},
});

export const Company = model('Company', companySchema);



