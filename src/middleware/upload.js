const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Caminho absoluto para a pasta uploads dentro de backend/src
const uploadPath = path.join(__dirname, "..", "uploads");

// 🔥 Garante que a pasta existe (evita o erro ENOENT)
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📂 Pasta 'uploads' criada automaticamente em:", uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
    filename: function (req, file, cb) {
  const ext = path.extname(file.originalname);
  const base = path.basename(file.originalname, ext);
  cb(null, `${base}-${Date.now()}${ext}`);
}


});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(
        new Error("Tipo de arquivo inválido. Envie JPG, PNG ou WEBP.")
      );
    }

    cb(null, true);
  },
});

module.exports = upload;
