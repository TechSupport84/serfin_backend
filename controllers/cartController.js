import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

/**
 * Add product to cart
 */
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Invalid input data." });
        }

        const product = await Product.findById(productId);
        if (!product || typeof product.price !== "number" || isNaN(product.price) || !Array.isArray(product.image)) {
            return res.status(404).json({ success: false, message: "Product not found or missing required fields." });
        }

        const imageUrl = product.image.length > 0 ? product.image[0] : "https://example.com/default-product-image.jpg";

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity, price: product.price, imageUrl });
        }

        cart.totalAmount = cart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        await cart.save();
        res.status(200).json({ success: true, message: "Product added to cart.", cart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

/**
 * Get user's cart
 */
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId }).populate("products.productId", "name price image");
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        res.status(200).json({ success: true, cart, totalAmount: cart.totalAmount });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

/**
 * Remove product from cart
 */
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        cart.products = cart.products.filter(item => item.productId.toString() !== productId);
        cart.totalAmount = cart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        await cart.save();
        res.status(200).json({ success: true, message: "Product removed from cart.", cart });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

/**
 * Clear the entire cart
 */
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOneAndDelete({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        res.status(200).json({ success: true, message: "Cart cleared successfully." });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};

export { addToCart, getCart, removeFromCart, clearCart };