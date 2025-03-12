import express  from  "express"
import { createOrder, getOrders, getOrderById, deleteOrder } from "../controllers/orderController.js";
import { authenticate } from "../middlewares/userMiddleWare.js";
const router = express.Router()

router.post("/create-order",authenticate, createOrder)
router.get("/", authenticate, getOrders);
router.get("/orderId/:id",authenticate,  getOrderById);
router.delete("/delete/:id", authenticate, deleteOrder);












export default router;