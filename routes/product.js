import express from "express";
import { authenticate,isAdmin } from "../middlewares/userMiddleWare.js";
import { createProduct ,deteleProduct, editProducts, getProductById, getProducts} from "../controllers/productController.js";
import { upload } from "../middlewares/Upload.js";
const router = express.Router()

router.get("/products",getProducts)
router.get("/byId/:id", getProductById)
router.post("/create",authenticate, isAdmin,upload.array("image",5),createProduct)
router.delete("/delete/:id",authenticate, isAdmin, deteleProduct)
router.put("/update/:id",authenticate, isAdmin,upload.array("image",5) ,editProducts)











export default router;