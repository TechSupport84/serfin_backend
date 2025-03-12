import Stripe from "stripe";
import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
    try {
        const { orderId, userId, paymentMethod, stripeToken } = req.body;

        if (!orderId || !userId || !paymentMethod || !stripeToken) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        // Charge the user using Stripe
        const charge = await stripe.charges.create({
            amount: order.totalAmount * 100,
            currency: "usd",
            source: stripeToken,
            description: `Payment for Order ${orderId}`
        });

        if (!charge.id) {
            return res.status(400).json({ success: false, message: "Payment failed." });
        }

        // Save payment record
        const payment = new Payment({
            orderId,
            userId,
            amount: order.totalAmount,
            paymentMethod,
            paymentStatus: "successful",
            transactionId: charge.id
        });

        await payment.save();

        // Update Order Payment Status
        order.paymentStatus = "paid";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment successful.",
            payment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Payment processing failed." });
    }
};
export const makaPayement = async (req, res) => {
    try {
      const { products } = req.body;
  
      const lineItems = products.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [], // Ensure valid image format
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "https://serfinrecycle.netlify.app/Success",
        cancel_url: "https://serfinrecycle.netlify.app/cancel",
      });
  
      res.json({ id: session.id });
    } catch (error) {
      console.error("Stripe payment error:", error.message);
      res.status(500).json({ error: "Payment failed" });
    }
  };
  

export const getPaymentDetails = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId)
            .populate("orderId")
            .populate("userId", "-password -role");

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found." });
        }

        res.status(200).json({ success: true, payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
