import express from "express";
import { processPayment, getPaymentDetails ,makaPayement} from "../controllers/paymentController.js";
import { authenticate} from "../middlewares/userMiddleWare.js";

const router = express.Router();

router.post("/process", authenticate ,processPayment);
router.get("/:paymentId",authenticate, getPaymentDetails);
router.post("/create-checkout-session", authenticate,makaPayement)

export default router;
