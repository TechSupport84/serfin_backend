import express  from  "express"
import { addToCart, getCart, removeFromCart, clearCart } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/userMiddleWare.js";

const router  = express.Router()

router.post("/add", authenticate, addToCart);
router.get("/:userId", authenticate, getCart);
router.delete("/remove",authenticate, removeFromCart);
router.delete("/:userId",authenticate,  clearCart);







export  default router;