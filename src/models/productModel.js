import  {Schema, model} from 'mongoose';
import mongoose from 'mongoose';

const productSchema = new Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true 
  },
  productImage: {
    type: String,
    required: [true, 'Please upload your product image'],
  },
  productName: {
    type: String,
    required: [true, 'Please what service are you rendering'],
  },
  productPrice: {
    type: Number,
    required: [true, 'Please what is the price of the service you are rendering'],
  },
  productDescription: {
    type: String,
    required: [true, 'Please provide a detailed description of the service you are rendering'],
  },
  status: {
    type: String,
    enum : {
      values: ['unassigned', 'pending', 'completed'],
      message: 'status not supported'
    },
    default: 'unassigned'
  },
  assignedTo : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
});

export const Product = model('Product', productSchema);
