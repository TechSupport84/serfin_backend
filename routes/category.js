import express from "express";
import { createCategory, getCategories, updateCategory,deleteCategory } from "../controllers/categoryController.js";
import { authenticate , isAdmin} from "../middlewares/userMiddleWare.js";
const router = express.Router();


router.post("/create",authenticate,isAdmin, createCategory)
router.get("/", getCategories);
router.put("/categories/:id",authenticate, isAdmin,  updateCategory);
router.delete("/categories/:id", authenticate, isAdmin, deleteCategory);





export default router;