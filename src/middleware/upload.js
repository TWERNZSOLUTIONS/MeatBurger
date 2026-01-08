const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// ===============================
// CONFIG CLOUDINARY
// ===============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===============================
// STORAGE CLOUDINARY
// ===============================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "meatburger/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto" }
    ],
  },
});

// ===============================
// MIDDLEWARE UPLOAD
// ===============================
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
