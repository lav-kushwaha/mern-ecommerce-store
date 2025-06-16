const Product = require("../../model/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "There are no products.",
      });
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.error(e); // <--- Add logging
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getFilteredProducts };
