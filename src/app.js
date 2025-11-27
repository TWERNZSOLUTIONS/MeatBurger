// backend/src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

const routes = require('./routes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

// CORS DEFINITIVO
app.use(
  cors({
    origin: [
      "https://meatburger.com.py",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://localhost:4000"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// middlewares globais
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rotas
app.use(routes);

// erro
app.use(errorHandler);

module.exports = app;
