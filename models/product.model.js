import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    brand: { type: String, trim: true, default: "Unknown" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    image: [
      {
        type: String,
  
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

