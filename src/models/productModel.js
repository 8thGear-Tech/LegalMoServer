import  {Schema, model} from 'mongoose';
//import { validateEmail, validatePassword } from '../utils/validation';

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, 'Please what service are you rendering'],
  },
  
});

export const Product = model('Product', productSchema);



