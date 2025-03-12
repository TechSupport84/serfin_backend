import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
    },
    password: {
        type: String,
        required: true
    },
    phone :String,
    address:[
        {
            street :String,
            city :String,
            state :String,
            country: String,
            zip:String

        }
    ],
    image: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ["admin", "client"],
        default: "client",
        required: true
    },
    wishlist: [
        {type :mongoose.Schema.Types.ObjectId,ref:"Product"}
    ]
}, { timestamps: true });

export const User =  mongoose.model("User", userSchema); 
