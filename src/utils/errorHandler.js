// backend/src/utils/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error('🔥 ERROR:', err);

  return res.status(500).json({
    error: 'Internal Server Error',
    message: err.message ?? 'Unexpected error',
  });
}

module.exports = { errorHandler };
