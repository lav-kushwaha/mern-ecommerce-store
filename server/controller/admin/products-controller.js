const { uploadImageToCloudinary } = require("../../helpers/cloudinary");
const Product = require("../../model/Product");


//Upload Image to cloudinary
const handleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const base64 = Buffer.from(file.buffer).toString('base64');
      const dataUri = `data:${file.mimetype};base64,${base64}`;
      const result = await uploadImageToCloudinary(dataUri);
      imageUrls.push(result.secure_url);
    }

    res.status(200).json({ success: true, data: imageUrls });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed.' });
  }
};

// Add New Product
const addProduct =  async (req, res) => {
  try {
    const { images, title, description, category, brand, price, salePrice, totalStock } = req.body;

    if (!images || images.length === 0 || !title || !description || !category || !brand || !price || !salePrice || !totalStock) {
      return res.status(400).json({ 
          success: false, 
          message: 'All fields are required including images.' 
        });
    }

    const product = new Product({ images, title, description, category, brand, price, salePrice, totalStock });
    await product.save();

    res.status(201).json({ 
      success: true,
      message:"Product added successfully..",
      data: product 
    });

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

// Fetch All Products
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean();

    res.status(200).json({
      success: true,
      message: "Products fetched successfully.",
      data: products,
    });

  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Edit Product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });

  } catch (error) {
    console.error("Edit Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });

  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
