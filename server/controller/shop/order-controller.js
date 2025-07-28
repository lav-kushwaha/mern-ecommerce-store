const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
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

    // Step 1: Create order without payment ID
    const newlyCreatedOrder = new Order({
      userId,
      userName,
      cartId,
      cartItems,
      addressInfo: {
        addressId: addressInfo.addressId,
        address: addressInfo.address,
        city: addressInfo.city,
        pincode: addressInfo.pincode,
        phone: addressInfo.phone,
        notes: addressInfo.notes || "",
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "unpaid",
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    await newlyCreatedOrder.save();

    // Step 2: Create PayPal order
    const paypalOrder = await paypal.createPaypalOrder(totalAmount, {
      return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-success?orderId=${newlyCreatedOrder._id}`,
      cancel_url: `${process.env.CLIENT_BASE_URL}/shop/checkout`,
    });

    // Step 3: Save PayPal payment ID
    newlyCreatedOrder.paymentId = paypalOrder.id;
    await newlyCreatedOrder.save();

    const approvalLink = paypalOrder.links.find(
      (link) => link.rel === "approve"
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

    const order = await Order.findById(orderId); //order db _id.

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

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }); 
      
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async(req,res)=>{
  try{

     const {id} = req.params;
     const order = await Order.findById(id);
     
     if(!order){
        return res.status(404).json({
          success:false,
          message:"Order not found!"
        })
     }

     res.status(200).json({
      success:true,
      data:order
    })

  }catch(error){
    console.log(error);
    res.status(500).json({
      success:false,
      message:"some error occured!"
    })
  }
}

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
