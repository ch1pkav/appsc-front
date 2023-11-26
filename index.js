// index.js
const express = require('express');
const app = express();
const http = require('http').Server(app);

// Serve static files
app.use(express.static('public'));

// Set up your routes

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});

