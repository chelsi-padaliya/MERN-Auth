// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes placeholder
app.use('/api/auth', require('./routes/authRoutes'));

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// db connection
mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log('DB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running ${PORT}`));
