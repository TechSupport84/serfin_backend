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

        // Fetch product details
        const product = await Product.findById(productId);
        if (!product || typeof product.price !== "number" || isNaN(product.price) || !Array.isArray(product.image)) {
            return res.status(404).json({ success: false, message: "Product not found or missing required fields." });
        }

        // Extract the first image or use a default placeholder
        const imageUrl = product.image.length > 0 ? product.image[0] : "https://example.com/default-product-image.jpg";

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                products: [{
                    productId,
                    quantity,
                    price: product.price,
                    imageUrl 
                }],
            });
        } else {
            const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
                cart.products[productIndex].imageUrl = imageUrl;
            } else {
                cart.products.push({
                    productId,
                    quantity,
                    price: product.price,
                    imageUrl 
                });
            }
        }

        // Correctly calculate total amount (sum of each price * quantity)
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

        const cart = await Cart.findOne({ userId }).populate("products.productId", "name price imageUrl");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        // Group products by _id and sum quantities
        const groupedProducts = {};
        cart.products.forEach(item => {
            const id = item.productId.toString();
            if (!groupedProducts[id]) {
                groupedProducts[id] = { ...item._doc, total: item.price * item.quantity };
            } else {
                groupedProducts[id].quantity += item.quantity;
                groupedProducts[id].total += item.price * item.quantity;
            }
        });

        const totalAmount = Object.values(groupedProducts).reduce((acc, item) => acc + item.total, 0);
        const totalQuantity = Object.values(groupedProducts).reduce((acc, item) => acc + item.quantity, 0);

        res.status(200).json({ 
            success: true, 
            cart: Object.values(groupedProducts), 
            totalAmount, 
            totalQuantity 
        });
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

        if (!cart || !Array.isArray(cart.products)) {
            return res.status(404).json({ success: false, message: "Cart not found." });
        }

        cart.products = cart.products.filter(item => item.productId.toString() !== productId);

        // Update total amount after removing an item
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
