const express = require('express');
const { getAllOrdersOfAllUser, getOrderDetailsForAdmin } = require('../../controller/admin/orders-controller');

const router = express.Router();

router.get('/get',getAllOrdersOfAllUser);
router.get('/details/:id',getOrderDetailsForAdmin);


module.exports = router;
