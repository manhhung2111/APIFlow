import express from "express";

const router = express.Router();

const {
  handleLoginUser,
  handleGetParcelById,
  handleVerifyUser,
} = require("../controllers/user");


router.post("/login", handleLoginUser);
router.post("/register", handleGetParcelById); 
router.delete("/logout", )

export default router;
