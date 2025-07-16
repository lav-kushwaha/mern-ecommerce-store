const express = require('express');
const { addProductReview, getProductReviews,checkPurchaseStatus } = require('../../controller/shop/product-review-controller');

const router = express.Router();

router.post('/check-purchase', checkPurchaseStatus);
router.post('/add',addProductReview);
router.get('/:productId',getProductReviews);

module.exports = router;