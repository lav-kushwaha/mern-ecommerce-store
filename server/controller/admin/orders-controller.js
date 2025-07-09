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

module.exports = {getAllOrdersOfAllUser,getOrderDetailsForAdmin};