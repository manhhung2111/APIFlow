import express from "express";

import {
    forgotPassword,
    getAllUsers,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    searchUsers,
    verifyUser
} from "@controllers/user";

const router = express.Router();

router.get("/", searchUsers);
router.get("/all", getAllUsers);

// Authentication routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify", verifyUser);
router.delete("/logout", logoutUser);

// Forgot password routes
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);


export default router;
