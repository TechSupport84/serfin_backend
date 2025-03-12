import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress, paymentMethod } = req.body;

        if (!userId || !shippingAddress || !paymentMethod) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Ensure shippingAddress contains all required fields
        const { street, city, state, country, zip } = shippingAddress;
        if (!street || !city || !state || !country || !zip) {
            return res.status(400).json({ success: false, message: "Complete shipping address is required." });
        }

        // Find the cart for the user
        const cart = await Cart.findOne({ userId }).populate("products.productId");

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.status(404).json({ success: false, message: "Cart is empty." });
        }

        // Extract items from cart
        const items = cart.products.map(item => ({
            productId: item.productId?._id,
            quantity: item.quantity,
            price: item.productId?.price
        }));

        const totalAmount = items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

        if (totalAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid total amount." });
        }

        // Generate tracking number
        const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        // Create the order and pass cartId
        const newOrder = new Order({
            userId,
            cartId: cart._id,  // ✅ Ensure cartId is passed correctly
            items,
            totalAmount,
            shippingAddress: { street, city, state, country, zip },
            paymentMethod,
            trackingNumber,
            status: "pending",
            paymentStatus: "pending",
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7-day delivery estimate
        });

        await newOrder.save();

        // Clear the cart after placing the order
        await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } });

        res.status(201).json({ success: true, message: "Order placed successfully!", order: newOrder });

    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "name email")
            .populate("items.productId", "name price"); // ✅ Ensure correct population

        // Recalculate totalAmount for each order
        const updatedOrders = orders.map(order => {
            const totalAmount = order.items.reduce((acc, item) => {
                return acc + (item.productId?.price || 0) * item.quantity;
            }, 0);

            return {
                ...order.toObject(), // Convert Mongoose document to plain object
                totalAmount, // Overwrite totalAmount with correct calculation
            };
        });

        res.status(200).json({ success: true, orders: updatedOrders });

    } catch (error) {
        console.error("Fetch orders error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "name email")
            .populate("items.productId", "name price"); 

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        res.status(200).json({ success: true, order });

    } catch (error) {
        console.error("Fetch order by ID error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        res.status(200).json({ success: true, message: "Order deleted successfully!" });

    } catch (error) {
        console.error("Delete order error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { createOrder, getOrders, getOrderById, deleteOrder };
