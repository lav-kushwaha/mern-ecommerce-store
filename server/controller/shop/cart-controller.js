const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

const mongoose = require("mongoose");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate inputs
    if (!userId || !productId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. userId, productId, and a positive quantity are required.",
      });
    }

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or productId format.",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex((item) =>
      item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      // Add new product to cart
      cart.items.push({
        productId: mongoose.Types.ObjectId(productId),
        quantity: Number(quantity),
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully.",
      data: cart,
    });

  } catch (error) {
    console.error("Error adding to cart:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};


const fetchCartItems = async(req,res)=>{
    try{
        const fetch = await Cart({});
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"error occured!"
        })
    }
}


const updateCartItemQty = async(req,res)=>{
    try{

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"error occured!"
        })
    }
}

const deleteCartItem = async(req,res)=>{
    try{

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"error occured!"
        })
    }
}


module.exports = {addToCart,fetchCartItems,updateCartItemQty,deleteCartItem}