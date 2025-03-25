import express from "express"
import { authenticate } from "../middlewares/userMiddleWare.js";
import { getSubscriptions, createSubscription } from "../controllers/subscriptionController.js";
const router = express.Router();

router.post("/", authenticate, createSubscription)
router.get("/subscribe", authenticate, getSubscriptions)





export default  router