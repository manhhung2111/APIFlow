import express from "express";

import {forgotPassword, loginUser, logoutUser, registerUser, resetPassword, verifyUser} from "@controllers/user";

const router = express.Router();

// Authentication routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify", verifyUser);
router.delete("/logout", logoutUser);

// Forgot password routes
router.post("/password/forgot", forgotPassword);
router.post("/password/reset", resetPassword);


export default router;
