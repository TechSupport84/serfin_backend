import express  from "express";
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
dotenv.config();
import router from "./routes/user.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.js"
import categoryRouter from './routes/category.js'
import orderRouter from "./routes/order.js";
import cartRouter from "./routes/cart.js";
import paymentRouter from "./routes/payment.js"

const port = process.env.PORT
const  app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}));

app.use("/api/auth",router)
app.use("/api/product", productRouter)
app.use("/api/category",categoryRouter)
app.use("/api/carts", cartRouter)
app.use("/api/orders",orderRouter)
app.use("/api/payment",paymentRouter)














app.listen(port,()=>{
    console.log(`Server  is running on port ${port}`)
    connectDB();
})