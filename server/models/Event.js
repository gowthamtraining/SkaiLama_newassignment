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
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    originalTimezone: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
