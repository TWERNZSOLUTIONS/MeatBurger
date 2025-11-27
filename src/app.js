// backend/src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

const routes = require('./routes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

// Segurança básica
app.use(helmet());

// Configuração do CORS
const corsOptions = {
  origin: "http://localhost:5173", // substitua pelo seu frontend
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
app.use(cors(corsOptions));

// 🚨 IMPORTANTE: Não interpretar multipart/form-data com express.json
app.use((req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) return next();
  express.json({ limit: '10mb' })(req, res, next);
});

app.use((req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) return next();
  express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

app.use(morgan('dev'));

// Servir arquivos estáticos da pasta uploads COM CORS
app.use(
  '/uploads',
  cors(corsOptions), // <-- permite acesso do frontend
  express.static(path.join(__dirname, 'uploads'))
);

// Rotas
app.use('/', routes);

// Healthcheck
app.get('/health', (req, res) => res.json({ ok: true }));

// Último middleware
app.use(errorHandler);

module.exports = app;
