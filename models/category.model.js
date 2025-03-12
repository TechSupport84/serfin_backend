import mongoose from "mongoose";
const CartegorySchema = new  mongoose.Schema({
    name: {type: String, required: true,unique: true},
    description :{type: String}
},{timestamps: true})

export const Category = mongoose.model("Category", CartegorySchema);