import express from "express";

import {
    forgotPassword,
    getAllUsers, loginGoogleUser,
    loginUser,
    logoutUser,
    registerUser,
    resetPassword,
    searchUsers, verifyEmail,
    verifyUser
} from "@controllers/user";
import authentication from "@middleware/authentication";
import SearchController from "@controllers/search";

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
router.post("/google-auth", loginGoogleUser);
router.post("/verify-email", verifyEmail);

router.post("/search", authentication, SearchController.search);


export default router;
