const express = require("express"); 
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");

const routes = require("./routes");
const { errorHandler } = require("./utils/errorHandler");

const app = express();

/**
 * ===============================
 * GARANTIR PASTA UPLOADS
 * ===============================
 */
const uploadsPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 Pasta uploads criada automaticamente");
}

/**
 * ===============================
 * SEGURANÇA / MIDDLEWARES
 * ===============================
 */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ===============================
 * CORS
 * ===============================
 */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * ===============================
 * SERVIR IMAGENS
 * ===============================
 */
app.use("/uploads", express.static(uploadsPath));

/**
 * ===============================
 * ROTAS BASE
 * ===============================
 */
app.get("/", (req, res) => {
  res.send("🔥 Backend MeatBurger funcionando!");
});

app.get("/doc", (req, res) => {
  res.send("📄 Documentação MeatBurger (em desenvolvimento)");
});

/**
 * ===============================
 * HEALTH CHECK (KEEP ALIVE)
 * ===============================
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

/**
 * ===============================
 * ROTAS DA API
 * ===============================
 */
app.use(routes);

/**
 * ===============================
 * ERROR HANDLER
 * ===============================
 */
app.use(errorHandler);

module.exports = app;
