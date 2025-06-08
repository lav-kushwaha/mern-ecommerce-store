const { uploadImageToCloudinary } = require("../../helpers/cloudinary");

const handleImageUpload = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // Convert buffer to Base64 Data URI
    const base64 = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`; //eg: edata:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...ABJRU5ErkJggg==

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

module.exports = {
  handleImageUpload,
};