import  {Router}  from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { AuthController } from "../controllers/auth.controller.js";
const router = Router();
const authController = new AuthController();

router.route("/signupInitialize").post(upload.single("avatar"),authController.signupInitiate);
router.route("/signupVerifyCode").post(authController.signupVerifyCode);
export default router;