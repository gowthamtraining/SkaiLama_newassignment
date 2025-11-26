import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import api from '../utils/api';

const EventForm = ({ onEventAdded }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        timezone: user?.defaultTimezone || dayjs.tz.guess(),
    });

    const { title, description, startTime, endTime, timezone } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        // Convert local time in selected timezone to UTC
        const startUtc = dayjs.tz(startTime, timezone).utc().format();
        const endUtc = dayjs.tz(endTime, timezone).utc().format();

        try {
            await api.post('/events', {
                title,
                description,
                startTime: startUtc,
                endTime: endUtc,
                originalTimezone: timezone
            });

            // Reset form
            setFormData({
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                timezone: user?.defaultTimezone || dayjs.tz.guess(),
            });

            onEventAdded();
        } catch (err) {
            console.error('Error adding event', err);
            alert('Failed to add event');
        }
    };

    // Common timezones list
    const timezones = [
        "UTC",
        "America/New_York",
        "America/Los_Angeles",
        "America/Chicago",
        "Europe/London",
        "Europe/Paris",
        "Asia/Tokyo",
        "Asia/Kolkata",
        "Australia/Sydney"
    ];

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Create New Event</h3>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-gray-400 mb-1">Event Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-400 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        rows="2"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">Start Time (Local)</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={startTime}
                        onChange={onChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">End Time (Local)</label>
                    <input
                        type="datetime-local"
                        name="endTime"
                        value={endTime}
                        onChange={onChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-gray-400 mb-1">Event Timezone</label>
                    <select
                        name="timezone"
                        value={timezone}
                        onChange={onChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                        {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        The times above are entered in this timezone. They will be converted to UTC for storage.
                    </p>
                </div>
                <div className="col-span-2">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;
