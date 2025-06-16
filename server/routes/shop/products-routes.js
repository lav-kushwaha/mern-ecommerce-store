const express = require('express');
const { getFilteredProducts } = require('../../controller/shop/products-controllers');

const router = express.Router();

router.get("/get",getFilteredProducts);

module.exports = router;
