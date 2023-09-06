import  {Schema, model} from 'mongoose';
//import { validateEmail, validatePassword } from '../utils/validation';

const userSchema = new Schema({
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
  contactPhone: {
    type: String,
    required: [true, 'Please provide a contact phone number'],
  },
  officialAddress: {
    type: String,
    required: [true, 'Please confirm your official address'],
  },
});

export const User = model('User', userSchema);



