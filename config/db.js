import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const conn  = await mongoose.connect(process.env.MONGO_URL)
         console.log("Connection  successfully ! ")
        
    } catch (error) {
        console.log("Connection  failed ! ")
        
    }
}
