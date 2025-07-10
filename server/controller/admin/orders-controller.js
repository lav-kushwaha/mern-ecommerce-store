const Order = require("../../models/Order");

const getAllOrdersOfAllUser = async (req, res) => {
  try {
    const orders = await Order.find({}); 
      
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

const getOrderDetailsForAdmin = async(req,res)=>{
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

const updateOrderStatus = async(req,res)=>{
  try{
      const {id} = req.params;
      const {orderStatus} = req.body;

      console.log(id, orderStatus)

       if(!orderStatus || !id){
        return res.status(404).json({
          success :false,
          message:"Invalid order status or id"
        })
      }

      const order = await Order.findById(id);

      if(!order){
          return res.status(404).json({
            success:false,
            message:"Order not found!"
          })
      }

     await Order.findByIdAndUpdate(id,{orderStatus});

     res.status(200).json({
      success:true,
      message:"Order status updated successfully!!"
    })

   }catch{
    console.log(error);
    res.status(500).json({
      success:false,
      message:"some error occured!"
    })
   }
}

module.exports = {getAllOrdersOfAllUser,getOrderDetailsForAdmin,updateOrderStatus};