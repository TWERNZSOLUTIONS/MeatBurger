// backend/src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

const routes = require("./routes"); 
const { errorHandler } = require("./utils/errorHandler");

// *** VOCÊ PRECISA CRIAR O APP AQUI ***
const app = express();

// Middlewares globais
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do CORS
const allowedOrigins = [
  "https://meatburger.com.py",
  "https://www.meatburger.com.py",
  "http://localhost:5173",
  "http://localhost:4000",
  process.env.FRONTEND_URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));

// Servir uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Rotas
app.use(routes);

// Middleware de erro
app.use(errorHandler);

module.exports = app;
