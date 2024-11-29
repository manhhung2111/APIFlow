import express from "express";

import {
    handleForgetPassword,
    handleLoginUser,
    handleLogoutUser,
    handleRegisterUser,
    handleResetPassword,
} from "@controllers/user";

const router = express.Router();

// @ts-ignore
router.post("/login", handleLoginUser);
// @ts-ignore
router.post("/register", handleRegisterUser);
router.delete("/logout", handleLogoutUser);

router.post("/password/forgot", handleForgetPassword);
router.post("/password/reset", handleResetPassword);

export default router;
