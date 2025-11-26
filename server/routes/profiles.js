const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().sort({ name: 1 });
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        let profile = await Profile.findOne({ name });

        if (profile) {
            return res.status(400).json({ msg: 'Profile already exists' });
        }

        profile = new Profile({ name });
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
