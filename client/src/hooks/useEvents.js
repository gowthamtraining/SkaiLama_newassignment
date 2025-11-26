import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useEvents = (currentProfile) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvents = useCallback(async () => {
        if (!currentProfile) {
            setEvents([]);
            return;
        }
        setLoading(true);
        try {
            const res = await api.get(`/events?profileId=${currentProfile._id}`);
            setEvents(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching events', err);
            setError('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    }, [currentProfile]);

    const createEvent = async (eventData) => {
        try {
            await api.post('/events', eventData);
            await fetchEvents();
            return true;
        } catch (err) {
            console.error('Error creating event', err);
            throw err;
        }
    };

    const updateEvent = async (id, eventData) => {
        try {
            await api.put(`/events/${id}`, eventData);
            await fetchEvents();
            return true;
        } catch (err) {
            console.error('Error updating event', err);
            throw err;
        }
    };

    const deleteEvent = async (id) => {
        try {
            await api.delete(`/events/${id}`);
            setEvents(prev => prev.filter(e => e._id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting event', err);
            throw err;
        }
    };

    return { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent };
};
