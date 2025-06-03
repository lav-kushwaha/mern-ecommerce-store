const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('../../model/user');

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
const login = async(req,res)=>{
    const{email,password} = req.body;
    try{

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Some error occured!"
        })
    }
}



//logout



//auth middleware



module.exports = {registerUser}