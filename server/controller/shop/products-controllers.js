const Product = require("../../model/Product");

//product filter
const getFilteredProducts = async (req, res) => {
  try {

    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;  // fallback default which is undefined, category === [] brand === [] if query is empty.

    let filters = {}; //If filters is empty, returns all products sorted accordingly.
    
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }    
   
    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async(req,res)=>{
   try{
    const {id} = req.params;

    if(!id){
      return res.status(400).json({
        success:false,
        message:"There is no product id.."
      });
    }

    const productDetails = await Product.findById(id);

    if(!productDetails){
      return res.status(404).json({
        success:false,
        message:"Product not found!"
      });
    }

    res.status(200).json({
      success:true,
      data:productDetails
    });

   }catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:"Internal server error!"
    })
   }
}

module.exports = { getFilteredProducts, getProductDetails };
