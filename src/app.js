const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

const routes = require("./routes");
const { errorHandler } = require("./utils/errorHandler");

const app = express();

// Helmet ajustado para não bloquear Render
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS liberado (Render exige isso)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Servir uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Rota raiz (teste backend)
app.get("/", (req, res) => {
  res.send("🔥 Backend MeatBurger funcionando!");
});

// Rota /doc (documentação)
app.get("/doc", (req, res) => {
  res.send("📄 Documentação MeatBurger (em desenvolvimento)");
});

// Rotas principais
app.use(routes);

// Middleware de erro
app.use(errorHandler);

module.exports = app;
