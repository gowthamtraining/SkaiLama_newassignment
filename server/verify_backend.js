const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let userId = '';

async function runTests() {
    try {
        console.log('--- Starting Backend Verification ---');

        // 1. Register User
        console.log('1. Registering User...');
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                username: 'testuser_' + Date.now(),
                password: 'password123',
                defaultTimezone: 'America/New_York'
            });
            token = regRes.data.token;
            userId = regRes.data.user.id;
            console.log('   [PASS] User registered. Token received.');
        } catch (err) {
            console.error('   [FAIL] Register:', err.response?.data || err.message);
            process.exit(1);
        }

        // 2. Create Event
        console.log('2. Creating Event...');
        const eventData = {
            title: 'Test Event',
            description: 'Testing API',
            startTime: new Date().toISOString(), // UTC
            endTime: new Date(Date.now() + 3600000).toISOString(), // UTC + 1h
            originalTimezone: 'America/New_York'
        };
        let eventId = '';
        try {
            const eventRes = await axios.post(`${API_URL}/events`, eventData, {
                headers: { 'x-auth-token': token }
            });
            eventId = eventRes.data._id;
            if (eventRes.data.title === eventData.title) {
                console.log('   [PASS] Event created.');
            } else {
                console.error('   [FAIL] Event data mismatch.');
            }
        } catch (err) {
            console.error('   [FAIL] Create Event:', err.response?.data || err.message);
        }

        // 3. Get Events
        console.log('3. Fetching Events...');
        try {
            const getRes = await axios.get(`${API_URL}/events`, {
                headers: { 'x-auth-token': token }
            });
            if (getRes.data.length > 0 && getRes.data[0]._id === eventId) {
                console.log('   [PASS] Events fetched successfully.');
            } else {
                console.error('   [FAIL] Event not found in list.');
            }
        } catch (err) {
            console.error('   [FAIL] Get Events:', err.response?.data || err.message);
        }

        // 4. Delete Event
        console.log('4. Deleting Event...');
        try {
            await axios.delete(`${API_URL}/events/${eventId}`, {
                headers: { 'x-auth-token': token }
            });
            console.log('   [PASS] Event deleted.');
        } catch (err) {
            console.error('   [FAIL] Delete Event:', err.response?.data || err.message);
        }

        console.log('--- Verification Complete ---');
    } catch (err) {
        console.error('Global Error:', err);
    }
}

// Wait for server to start (manual delay in real usage, but here we assume it's running or we start it)
runTests();
