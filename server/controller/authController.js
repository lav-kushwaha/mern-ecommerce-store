const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const existedEmail = await User.findOne({ email });
    if (existedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      userName,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
      expiresIn: "2d"
    });

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully."
    });
  } catch (err) {
    console.log("Register error:", err.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, {
      expiresIn: "2d"
    });

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) 
    });

    return res.status(200).json({
      success: true,
      message: "Login successful."
    });

  } catch (err) {
    console.log("Login error:", err.message);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { register, login };
