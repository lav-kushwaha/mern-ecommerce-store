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

    // Create PayPal order
    const paypalOrder = await paypal.createPaypalOrder(totalAmount);

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
      paymentId: paypalOrder.id,
    });

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

    const captureData = await paypal.capturePaypalOrder(orderID);

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
