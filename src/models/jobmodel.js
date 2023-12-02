import  {Schema, model} from 'mongoose';
import mongoose from 'mongoose';

const jobSchema = new Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    companyDetail: {
      type: String,
    },
    companyFile: {
      type: String,
    },
    adminDetail: {
      type: String,
    },
    adminFile: {
      type: String,
    },
    lawyerRequestedDetail: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ['unassigned', 'pending', 'completed'],
        message: 'status not supported',
      },
      default: 'unassigned',
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lawyer',
      },
    ],
    appliedLawer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lawyer',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Job = model('Job', jobSchema);
 