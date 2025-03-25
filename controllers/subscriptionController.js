import { Subscription } from "../models/subscription.model.js";

const createSubscription = async (req, res) => {
  const userId = req.user._id; 
  try {
    const { amount } = req.body;

    if (!userId || !amount) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }


    const activeSubscription = await Subscription.findOne({
      userId: userId,
      endDate: { $gte: new Date() }, 
    });

    if (activeSubscription) {
      return res.status(400).json({ message: "You already have an active subscription" });
    }

    // Create new subscription
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = new Subscription({ userId, amount, startDate, endDate });
    await subscription.save();

    res.status(201).json({ message: "Subscription created successfully", subscription });
  } catch (err) {
    console.error("Error creating subscription:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1); // Set to one day ahead

    const subscriptions = await Subscription.find()
      .populate("userId", "name email") // Populate user details
      .select("userId amount startDate endDate"); // Select relevant fields

    // Check for subscriptions expiring today or tomorrow
    const expiringSubscriptions = subscriptions.filter(sub => {
      const endDate = new Date(sub.endDate);
      return endDate.toDateString() === today.toDateString() || endDate.toDateString() === tomorrow.toDateString();
    });

    // Prepare response message
    let message = "Subscriptions fetched successfully.";
    if (expiringSubscriptions.length > 0) {
      message = "Some subscriptions are expiring soon! Please renew.";
    }

    res.status(200).json({ 
      total: subscriptions.length, 
      subscriptions, 
      expiringSubscriptions: expiringSubscriptions.length, 
      message 
    });
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createSubscription, getSubscriptions };
