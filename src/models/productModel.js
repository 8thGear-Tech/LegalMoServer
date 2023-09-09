import  {Schema, model} from 'mongoose';
//import { validateEmail, validatePassword } from '../utils/validation';

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, 'Please what service are you rendering'],
  },
  productPrice: {
    type: String,
    required: [true, 'Please what is the price of the service you are rendering'],
  },
  productDescription: {
    type: String,
    required: [true, 'Please provide a detailed description of the service you are rendering'],
  },
});

export const Product = model('Product', productSchema);



