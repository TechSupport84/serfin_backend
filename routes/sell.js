import express  from "express"
import { getAllSellers,sellProduct } from "../controllers/sellController.js"
import { checkSubscription } from "../middlewares/checkSubscription.js"
import { authenticate } from "../middlewares/userMiddleWare.js"
import { upload } from "../middlewares/Upload.js"
const router = express.Router()

router.post("/", authenticate, checkSubscription,upload.array("image",5), sellProduct)
router.get("/", authenticate, getAllSellers)















export default router