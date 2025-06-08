const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

async function uploadImageToCloudinary(file) {
    const result = await cloudinary.uploader.upload(file,{
        resource_type:'auto'
    });
    return result;
}

//multer to get file from req or from client side.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

module.exports = {upload,uploadImageToCloudinary}