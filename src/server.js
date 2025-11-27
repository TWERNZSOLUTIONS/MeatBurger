// backend/src/server.js
require('dotenv').config();
const app = require('./app');

// Render fornece a porta via environment variable
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
