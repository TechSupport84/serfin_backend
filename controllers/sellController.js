import { Sell } from "../models/sell.model.js";
import { Subscription } from "../models/subscription.model.js";

const sellProduct = async (req, res) => {
  const userId = req.user._id;
  const imageUrlPath = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];
  try {
    const { productName, description, image, category, amount } = req.body;

    if (!userId || !productName || !amount) {
      return res.status(400).json({ message: "User ID, product name, and amount are required" });
    }

    const activeSubscription = await Subscription.findOne({
      userId:userId,
      endDate: { $gte: new Date() },
    });

    if (!activeSubscription) {
      return res.status(403).json({ message: "You must have an active subscription to sell" });
    }

    // Create and save the new sell item
    const sellItem = new Sell({ userId, productName, description, image:imageUrlPath, category, amount });
    await sellItem.save();

    res.status(201).json({ message: "Product listed successfully", sellItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all sellers and their products.
 */
const getAllSellers = async (req, res) => {
  try {
    const sellItems = await Sell.find().populate("userId", "name email");
    res.status(200).json({ total: sellItems.length, sellItems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { sellProduct, getAllSellers };
