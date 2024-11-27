import express from "express";

const router = express.Router();

import {
    handleLoginUser,
    handleRegisterUser,
    handleLogoutUser,
    handleForgetPassword,
    handleResetPassword
} from "../controllers/user";


router.post("/login", handleLoginUser);
// @ts-ignore
router.post("/register", handleRegisterUser);
router.delete("/logout", handleLogoutUser);

router.post("/password/forgot", handleForgetPassword);
router.post("/password/reset", handleResetPassword);

export default router;
