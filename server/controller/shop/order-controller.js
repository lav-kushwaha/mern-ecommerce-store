const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      paymentMethod,
      totalAmount,
      cartId,
    } = req.body;

    if (
      !addressInfo?.address ||
      !addressInfo?.city ||
      !addressInfo?.pincode ||
      !addressInfo?.phone ||
      !addressInfo?.addressId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing addressInfo fields.",
      });
    }

    // 1. Save the order first (with no PayPal order ID yet)
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: 'pending',
      paymentMethod,
      paymentStatus: 'unpaid',
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    await newlyCreatedOrder.save();

    // 2. Now create the PayPal order using the order ID
    const paypalOrder = await paypal.createPaypalOrder(totalAmount, {
      return_url: `http://localhost:5173/shop/paypal-success?orderId=${newlyCreatedOrder._id}`,
      cancel_url: 'http://localhost:5173/shop/checkout',
    });

    // 3. Save the PayPal payment ID to the order
    newlyCreatedOrder.paymentId = paypalOrder.id;
    await newlyCreatedOrder.save();

    const approvalLink = paypalOrder.links.find(
      (link) => link.rel === 'approve'
    )?.href;

    res.status(201).json({
      success: true,
      approvalURL: approvalLink,
      orderId: newlyCreatedOrder._id,
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the order",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { orderID, orderId } = req.body;

    console.log(orderID, orderId);
    

    const captureData = await paypal.capturePaypalOrder(orderID);

    console.log(captureData, "capdata");
    

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order info
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = captureData.id;
    order.payerId = captureData.payer.payer_id;

    // Reduce stock
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);
      if (!product || product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for product: ${item.title}`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment successful and order confirmed",
      data: order,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Payment capture failed",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
};
