import express  from  "express"
import {register, getUser, updateUserProfile, modifyPassword, deleteUser,getAllUsers} from "../controllers/userController.js";
import { userLogin } from "../controllers/userController.js";
import { authenticate , isAdmin, me} from "../middlewares/userMiddleWare.js";
import { upload } from "../middlewares/Upload.js";
const router = express.Router();


router.post("/register",upload.single("image"), register)
router.post("/login", userLogin)
router.get("/", authenticate, getAllUsers);
router.get("/me", authenticate, me);
router.get("/users/:id", authenticate, getUser);
router.put("/users/:id",authenticate, upload.single("image"), updateUserProfile);
router.put("/users/:id/password",authenticate,  modifyPassword);
router.delete("/users/:id", authenticate, deleteUser);



export default  router;


