import mongoose from "mongoose";

const sellSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    productName: { type: String, required: true },
    description: { type: String, required: true },
    image: [{ type: String }], 
    category: { type: String, enum: ["electronics", "clothing", "shoes", "others"], required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Sell  =  mongoose.model("Sell", sellSchema);
