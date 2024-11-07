// Import Express
const express = require('express');

// Create an Express application
const app = express();

// Define a port for the server
const PORT = process.env.PORT || 3000;

// Define a basic route to test the server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
