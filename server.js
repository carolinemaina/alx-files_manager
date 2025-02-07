// server.js
import express from 'express';
import routes from './routes/index.js'; // Import routes

// Initialize Express app
const app = express();

// Set port from environment variable or default to 5000
const port = process.env.PORT || 5000;

// Load all routes
app.use(routes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
