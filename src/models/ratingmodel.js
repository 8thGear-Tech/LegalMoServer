import  {Schema, model} from 'mongoose';
import mongoose from 'mongoose';

const ratingSchema = new Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true 
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
  },
  reviewTitle: {
    type: String,
  },
  review: {
    type: String,
  },
  status: {
    type: Number,
    enum : {
      values: [1, 2, 3, 4, 5],
      message: 'rating not supported'
    },
    default: 1
  },
  date: {
    type: Date,
    default: Date.now
  },
},
    {
        timestamps: true
    }
);

export const Rating = model('Rating', ratingSchema);
 