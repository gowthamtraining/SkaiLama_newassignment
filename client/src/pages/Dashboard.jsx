import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import EventForm from '../components/EventForm';
import dayjs from 'dayjs';
import { Trash2, Clock, MapPin } from 'lucide-react';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [displayTimezone, setDisplayTimezone] = useState(user?.defaultTimezone || dayjs.tz.guess());

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error('Error fetching events', err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter(event => event._id !== id));
            } catch (err) {
                console.error('Error deleting event', err);
            }
        }
    };

    const formatTime = (utcDate) => {
        return dayjs(utcDate).tz(displayTimezone).format('MMMM D, YYYY h:mm A');
    };

    // Common timezones list (duplicated for now, could be shared)
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
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Your Events</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">View in:</span>
                    <select
                        value={displayTimezone}
                        onChange={(e) => setDisplayTimezone(e.target.value)}
                        className="bg-gray-700 text-white text-sm p-1 rounded border border-gray-600 focus:outline-none"
                    >
                        {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                </div>
            </div>

            <EventForm onEventAdded={fetchEvents} />

            <div className="space-y-4">
                {events.length === 0 ? (
                    <p className="text-center text-gray-500">No events found. Create one above!</p>
                ) : (
                    events.map(event => (
                        <div key={event._id} className="bg-gray-800 p-4 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                                <p className="text-gray-400 mb-2">{event.description}</p>

                                <div className="flex items-center text-sm text-gray-300 mb-1">
                                    <Clock size={16} className="mr-2 text-blue-400" />
                                    <span>
                                        {formatTime(event.startTime)} - {formatTime(event.endTime)} ({displayTimezone})
                                    </span>
                                </div>

                                <div className="flex items-center text-xs text-gray-500">
                                    <MapPin size={14} className="mr-1" />
                                    <span>Original: {event.originalTimezone}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(event._id)}
                                className="text-red-400 hover:text-red-300 p-2 transition duration-200"
                                title="Delete Event"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
