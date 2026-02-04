// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes placeholder
app.use('/api/auth', require('./routes/authRoutes'));

// db connection
mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log('DB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running ${PORT}`));
