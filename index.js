import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import fs from "fs"; // Import filesystem module

dotenv.config();

import router from "./routes/user.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.js";
import categoryRouter from "./routes/category.js";
import orderRouter from "./routes/order.js";
import cartRouter from "./routes/cart.js";
import paymentRouter from "./routes/payment.js";
import subscribeRouter from "./routes/subscription.js";
import sellerRouter from "./routes/sell.js";

const port = process.env.PORT || 5000; // Ensure a default port if not in .env
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploads folder as static
app.use("/uploads", express.static(uploadDir));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "*", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/auth", router);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/sell", sellerRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});
