const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const EventLog = require('../models/EventLog');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

router.get('/', async (req, res) => {
    try {
        const { profileId } = req.query;
        const query = profileId ? { profiles: profileId } : {};
        const events = await Event.find(query).populate('profiles').sort({ startTime: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, startTime, endTime, originalTimezone, profileIds } = req.body;

        const newEvent = new Event({
            title,
            description,
            startTime,
            endTime,
            originalTimezone,
            profiles: profileIds
        });

        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, description, startTime, endTime, originalTimezone, profileIds } = req.body;

        let event = await Event.findById(req.params.id).populate('profiles');
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        const changes = [];

        if (new Date(event.startTime).toISOString() !== new Date(startTime).toISOString() ||
            new Date(event.endTime).toISOString() !== new Date(endTime).toISOString()) {
            changes.push(`End date/time updated`);
        }

        const oldProfileIds = event.profiles.map(p => p._id.toString()).sort();
        const newProfileIds = profileIds.sort();
        const profilesChanged = JSON.stringify(oldProfileIds) !== JSON.stringify(newProfileIds);

        if (profilesChanged) {
            const Profile = require('../models/Profile');
            const newProfiles = await Profile.find({ _id: { $in: profileIds } });
            const newProfileNames = newProfiles.map(p => p.name).join(', ');
            changes.push(`Profiles changed to: ${newProfileNames}`);
        }

        event.title = title;
        event.description = description;
        event.startTime = startTime;
        event.endTime = endTime;
        event.originalTimezone = originalTimezone;
        event.profiles = profileIds;

        await event.save();

        for (const msg of changes) {
            await new EventLog({
                eventId: event._id,
                message: msg
            }).save();
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        await event.deleteOne();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id/logs', async (req, res) => {
    try {
        const logs = await EventLog.find({ eventId: req.params.id }).populate("eventId").sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
