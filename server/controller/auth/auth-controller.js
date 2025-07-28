const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../../models/User');

// Register
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
  
    });
  }

  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already taken.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const token = jwt.sign({ _id: newUser._id }, process.env.JWTSECRET, {
      expiresIn: '2d',
    });

    // res.cookie('token', token, {
    //     httpOnly: true,
    //     maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    // });

    // res.cookie('token', token, {
    //     httpOnly: true,
    //     maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    //     secure: true
    // });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token: token,
      user: {
        _id: newUser._id,
        email: newUser.email,
        userName: newUser.userName,
        role: newUser.role
      }
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Login
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials."
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWTSECRET,
      { expiresIn: '2d' }
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    //   secure: false
    // });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    //   secure: true
    // });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token: token,
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        role: user.role
      }
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

// Logout
const logoutUser = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully."
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Logout failed."
    });
  }
};

// Auth Middleware with Cookies
// const authMiddleware = async (req, res, next) => {
//   const { token } = req.cookies;

//   try {
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized User!",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWTSECRET);
//     const { _id } = decoded;

//     const user = await User.findById(_id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found!",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized User!",
//     });
//   }
// };

// Auth Middleware with SessionStorage (Authorization Header)
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader?.split(' ')[1];

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const { _id } = decoded;

    const user = await User.findById(_id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found!",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized User!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };