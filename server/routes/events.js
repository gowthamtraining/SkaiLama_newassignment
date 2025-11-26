const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Get all events for user
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id }).sort({ startTime: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create Event
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, startTime, endTime, originalTimezone } = req.body;

        // Ensure times are stored as UTC
        // The frontend should send ISO strings, but we can double check or convert if needed.
        // Assuming frontend sends: "2023-10-27T10:00:00" (local time string) and "America/New_York"
        // We need to interpret that time IN that timezone, then convert to UTC.

        // However, simpler approach: Frontend sends ISO UTC strings directly.
        // Let's assume frontend handles the conversion to UTC before sending, 
        // OR we trust the ISO string provided is the correct absolute time.

        // Let's stick to the plan: Backend stores UTC.
        // We will save exactly what is passed, assuming it's a valid date string.

        const newEvent = new Event({
            title,
            description,
            startTime,
            endTime,
            originalTimezone,
            user: req.user.id
        });

        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Event
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await event.deleteOne();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
