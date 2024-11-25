import express from "express";

const router = express.Router();

import {
    handleLoginUser,
    handleRegisterUser,
    handleLogoutUser,
    handleForgetPassword,
    handleResetPassword
} from "../controllers/workspace";

router.get("/", handleLoginUser);
router.get("/:id", handleRegisterUser);
router.post("/create", handleLoginUser);
router.put("/edit", handleRegisterUser);
router.delete("/delete", handleLogoutUser);

router.post("/users/")

router.post("/password/forgot", handleForgetPassword);
router.post("/password/reset", handleResetPassword);

export default router;
