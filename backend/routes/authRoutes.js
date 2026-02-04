const router = require("express").Router();
const {
  registerUser,
  loginUser,
  sendOTP,
  verifyOTP,
  resetPassword,
  dashboard,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// 🔐 PROTECTED
router.get("/dashboard", authMiddleware, dashboard);


module.exports = router;
