import { Subscription } from "../models/subscription.model.js";

const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check for an active subscription
    const activeSubscription = await Subscription.findOne({
      userId:userId,
      endDate: { $gte: new Date() },
    });

    if (!activeSubscription) {
      return res.status(403).json({ message: "You need an active subscription to sell items." });
    }

    next(); // Proceed to next function if subscription is active
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { checkSubscription };
