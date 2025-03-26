import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import fs from "fs";

dotenv.config();

import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import categoryRouter from "./routes/category.js";
import orderRouter from "./routes/order.js";
import cartRouter from "./routes/cart.js";
import paymentRouter from "./routes/payment.js";
import subscribeRouter from "./routes/subscription.js";
import sellerRouter from "./routes/sell.js";

const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "*", 
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/sell", sellerRouter);

connectDB().then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(error => {
    console.error("Database connection failed:", error);
    process.exit(1); 
});
