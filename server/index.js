const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skailama_assignment')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
// app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/profiles', require('./routes/profiles'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
