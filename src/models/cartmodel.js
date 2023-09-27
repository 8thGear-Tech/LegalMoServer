import  {Schema, model} from 'mongoose';
import mongoose from 'mongoose';

const cartSchema = new Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true 
  },
  products: [{
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true 
    },
    name : String,
    quantity: {
        type: Number,
        required: true, 
        min: 1,
        default: 1
    },
    price: Number
  }],
  bill: {
    type: Number,
    required : true, 
    default: 0
  }
},
    {
        timestamps: true
    }
);

export const Product = model('Cart', cartSchema);
