const Product = require("../../models/Product");

//product filter and pagination
const getFilteredProducts = async (req, res) => {
  try {
    const { category, brand, sortBy, page = 1, limit = 8 } = req.query;

    const filters = {};
    if (category) filters.category = { $in: Array.isArray(category) ? category : [category] };
    if (brand) filters.brand = { $in: Array.isArray(brand) ? brand : [brand] };

    const sortOptions = {
      "price-lowtohigh": { price: 1 },
      "price-hightolow": { price: -1 },
      "newest": { createdAt: -1 },
      "top-rated":{averageReview:-1},
      "title-atoz":{title:1},
      "title-ztoa":{title:-1},
    };

    const sort = sortOptions[sortBy] || { price : 1};

    const currentPage = Math.max(parseInt(page) || 1, 1);
    const skip = (currentPage - 1) * parseInt(limit);

    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: products,
      total,
      page: currentPage,
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error("Product fetch error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
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
