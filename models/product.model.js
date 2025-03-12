import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    brand: { type: String, trim: true },
    stock: { type: Number, required: true, min: 0 },
    image: [{ type: String }],
    rating: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: { type: Number, min: 1, max: 5 },
            review: { type: String, trim: true }
        }
    ]
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
