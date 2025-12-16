import  {Router}  from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";
const router = Router();
const authController = new AuthController();

router.route("/signup").post(upload.single("avatar"),authController.signup)
export default router;