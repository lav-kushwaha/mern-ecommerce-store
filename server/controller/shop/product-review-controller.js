const Order = require('../../models/Order');
const Product = require('../../models/Product');
const ProductReview = require('../../models/Review');

//Internal helper to check if user purchased product
const hasUserPurchasedProduct = async (userId, productId) => {
  if (!userId || !productId) return false;

  const order = await Order.findOne({
    userId,
    'cartItems.productId': productId,
    orderStatus: 'confirmed',
  });

  return !!order;
};

//Internal helper to validate fields
const isReviewDataValid = ({ productId, userId, userName, title, comment, rating }) => {
  return productId && userId && userName && title && comment && rating;
};

//Add a new product review
const addProductReview = async (req, res) => {
  try {
    const reviewData = req.body;

    if (!isReviewDataValid(reviewData)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields.',
      });
    }

    const { productId, userId, userName, title, comment, rating } = reviewData;

    const hasPurchased = await hasUserPurchasedProduct(userId, productId);
    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'You must purchase this product before reviewing it.',
      });
    }

    const existingReview = await ProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product.',
      });
    }

    const newReview = new ProductReview({ productId, userId, userName, title, comment, rating });
    await newReview.save();

    const allReviews = await ProductReview.find({ productId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;

    await Product.findByIdAndUpdate(productId, { averageReview: averageRating });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      data: newReview,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;    

    const reviews = await ProductReview.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

//Check if user has purchased the product
const checkPurchaseStatus = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId or productId.',
      });
    }

    const hasPurchased = await hasUserPurchasedProduct(userId, productId);

    res.status(200).json({
      success: true,
      hasPurchased,
    });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      hasPurchased: false,
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews,
  checkPurchaseStatus,
};
