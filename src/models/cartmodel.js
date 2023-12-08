import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const cartSchema = new Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          default: 1,
        },
        detail: {
          type: String,
        },
        file: {
          type: String,
        },
        fileName: {
          type: String,
        },
        price: Number,
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    // paystack starts
    // paystackReference: {
    //   type: String,
    // },
    // transactionStatus: {
    //   type: String,
    //   default: "Pending", // You can set a default status
    // },
    // paymentStatus: {
    //   type: String,
    //   enum: ["pending", "success", "failed"],
    // },
    // currency: {
    //   type: String,
    //   required: [true, "currency is required"],
    //   enum: ["NGN", "USD", "EUR", "GBP"],
    // },
    // transactionDate: {
    //   type: Date,
    // },
    // referenceNumber: {
    //   type: String,
    // },
    // paystack ends
  },

  // {
  //   paystackReference: {
  //     type: String,
  //   },
  // },
  {
    timestamps: true,
  }
);

export const Cart = model("Cart", cartSchema);
