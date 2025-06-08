const { uploadImageToCloudinary } = require("../../helpers/cloudinary");
const Product = require("../../model/product");

const handleImageUpload = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // Convert buffer to Base64 Data URI
    const base64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`; //eg:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...ABJRU5ErkJggg==

    // Upload to Cloudinary
    const result = await uploadImageToCloudinary(dataUri);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });

  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message || "Unknown server error",
    });
  }
};

// Add New Product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    if (!image || !title || !description || !category || !brand || !price || !salePrice || !totalStock) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      data: newProduct,
    });

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

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
