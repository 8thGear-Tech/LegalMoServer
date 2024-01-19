import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const transactionSchema = new Schema(
  {
    ref: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
    },
    currency: {
      type: String,
      required: [true, "currency is required"],
      enum: ["NGN", "USD", "EUR", "GBP"],
    },
    amount: {
      type: Number,
    },
    // transactionDate: {
    //   type: Date,
    // },
    // Update with the actual currency
  },
  {
    timestamps: true,
  }
);

export const Transaction = model("Transaction", transactionSchema);
