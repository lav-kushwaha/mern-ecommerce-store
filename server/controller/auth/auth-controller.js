const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../../models/User');

// Register
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields.",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists.",
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

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        });

        res.status(201).json({
            success: true,
            message: "Registration successful.",
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Server error.",
        });
    }
};

//Login
const loginUser = async (req, res) => {
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

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      secure:false
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
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

//logout
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

//auth middleware
const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  
  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const { _id } = decoded;

    const user = await User.findById(_id).select("-password"); //  don't fetch password

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

module.exports = {registerUser,loginUser,logoutUser,authMiddleware}