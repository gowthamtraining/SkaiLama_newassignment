const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "*", // Allow all origins for now, or specify your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skailama_assignment')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.get("/health-check", (req, res) => {
    res.send("OK");
});

app.get("/", (req, res) => {
    res.send("Backend is running. Use /api/events or /api/profiles to access data.");
});

app.use('/api/events', require('./routes/events'));
app.use('/api/profiles', require('./routes/profiles'));

// Export the app for Vercel
module.exports = app;

// Only listen if run directly (local dev)
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
