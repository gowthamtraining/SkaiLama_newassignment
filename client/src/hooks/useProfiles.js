import { useState, useCallback, useEffect } from 'react';
import api from '../utils/api';

export const useProfiles = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/profiles');
            setProfiles(res.data);
            return res.data;
        } catch (err) {
            console.error('Error fetching profiles', err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const addProfile = async (name) => {
        try {
            const res = await api.post('/profiles', { name });
            setProfiles(prev => [...prev, res.data]);
            return res.data;
        } catch (err) {
            console.error('Error adding profile', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    return { profiles, loading, addProfile };
};
