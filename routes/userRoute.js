import express from "express";
import auth from "../middleware/auth.js";
import {
    userRegister,
    login,
    findUsers,
    // forgotPassword,
    // resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/user/register", userRegister);
router.post("/user/login", login);
router.get("/fetch-users", findUsers);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset", resetPassword);

export default router;