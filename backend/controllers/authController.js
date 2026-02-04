const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail");

/* ================= REGISTER ================= */
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    isVerified: false,
  });

  res.status(201).json({ success: true, message: "Registered successfully" });
};

/* ================= LOGIN ================= */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Please verify your email first" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ success: true, token });
};

/* ================= SEND OTP (REGISTER + FORGOT) ================= */
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  user.otp = await bcrypt.hash(otp, 10);
  user.otpExpiry = Date.now() + 1 * 60 * 1000;
  await user.save();

  await sendEmail(
    email,
    "OTP Verification",
    `<h2>Your OTP is ${otp}</h2><p>Valid for 1 minute</p>`
  );

  res.json({ success: true, message: "OTP sent" });
};

/* ================= VERIFY OTP (REGISTER ONLY) ================= */
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.otp)
    return res.status(400).json({ message: "OTP not found" });

  if (user.otpExpiry < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid OTP" });

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ success: true, message: "Email verified" });
};

/* ================= RESET PASSWORD (FORGOT FLOW) ================= */
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "All fields are required" });

  const user = await User.findOne({ email });
  if (!user || !user.otp)
    return res.status(400).json({ message: "OTP not found" });

  if (user.otpExpiry < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid OTP" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};

exports.dashboard = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
};
