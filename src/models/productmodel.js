import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    productImage: {
      type: String,
      required: [true, "Please upload your product image"],
    },
    productImage_id: {
      type: String,
    },
    productName: {
      type: String,
      required: [true, "Please what service are you rendering"],
    },
    productPrice: {
      type: Number,
      required: [
        true,
        "Please what is the price of the service you are rendering",
      ],
    },
    productDescription: {
      type: String,
      required: [
        true,
        "Please provide a detailed description of the service you are rendering",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model("Product", productSchema);
