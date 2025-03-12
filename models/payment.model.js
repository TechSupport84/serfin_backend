import mongoose from "mongoose";
const paymentShema = new mongoose.Schema({
    orderId: {type:mongoose.Schema.Types.ObjectId, ref:"Order", required:true},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"User", required :true},
    amount:{type:Number,required:true},
    paymentMethod:{type: String,required:true},
    paymentStatus: {type:String,enum:["successful","failed"],default:"successful"},
    transactionId:{type:String,unique:true}
},{timestamps: true});

export const Payment = mongoose.model("Payment",paymentShema)