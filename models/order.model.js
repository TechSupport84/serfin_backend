import mongoose  from "mongoose";

const OrderShema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    cartId :{type: mongoose.Schema.Types.ObjectId, ref:"Cart", required:true},
    totalAmount :{type: Number, required:true},
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],

    status:{
        type: String,
        enum:["pending", "shipped","delivered","cancelled"],
        default: "pending"},
    paymentStatus:{
        type:String,
        enum:["pending","paid","failed"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ["card", "paypal", "bank_transfer", "cash_on_delivery"],
        required: true
    },
    
    trackingNumber: { type: String, default: null },
    estimatedDelivery: { type: Date, default: null },
    shippingAddress:{
        street: String,
        city:String,
        state:String,
        country:String,
        zip: String
    },


},{timestamps: true})

export const  Order = mongoose.model("Order", OrderShema);