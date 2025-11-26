const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    }],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    startTime: {
        type: Date, // Stored in UTC
        required: true,
    },
    endTime: {
        type: Date, // Stored in UTC
        required: true,
    },
    originalTimezone: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
