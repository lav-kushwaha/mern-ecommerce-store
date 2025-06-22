const mongoose = require("mongoose");
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

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


const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "A valid User ID is required.",
      });
    }

    // Fetch cart with populated product details
    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user.",
      });
    }

    // Filter out removed or invalid products
    const validItems = cart.items.filter((item) => item.productId);

    // If any invalid product references found, clean them up
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save(); // Clean up the cart in DB
    }

    // Format the response items
    const formattedItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    // Send final response
    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully.",
      data: {
        _id: cart._id,
        userId: cart.userId,
        items: formattedItems,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};


const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate inputs
    if (!userId || !productId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // Find cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    // Check if product exists in cart
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    // Update quantity
    cart.items[productIndex].quantity = quantity;

    // Save changes
    await cart.save();

    // Populate product details
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // Format response
    const formattedItems = cart.items
      .filter((item) => item.productId) // Remove any deleted/invalid products
      .map((item) => ({
        productId: item.productId._id,
        image: item.productId.image,
        title: item.productId.title,
        price: item.productId.price,
        salePrice: item.productId.salePrice,
        quantity: item.quantity,
      }));

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully.",
      data: {
        _id: cart._id,
        userId: cart.userId,
        items: formattedItems,
        updatedAt: cart.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error updating cart item quantity:", err.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};


const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required.",
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    // Filter out the item
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    // Save updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item deleted successfully.",
      data: cart.items,
    });
    
  } catch (err) {
    console.error("Error deleting cart item:", err);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};



module.exports = {addToCart,fetchCartItems,updateCartItemQty,deleteCartItem}