import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import dayjs from 'dayjs';
import { X, Clock } from 'lucide-react';

const EventLogsModal = ({ event, onClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(logs,"logs")
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get(`/events/${event._id}/logs`);
                setLogs(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching logs', err);
                setLoading(false);
            }
        };

        if (event) {
            fetchLogs();
        }
    }, [event]);

    if (!event) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Event Update History</h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">Loading logs...</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            No update history yet
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map(log => (
                                <div key={log._id} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                    <div className="flex items-center text-xs text-gray-400 mb-1">
                                        <Clock size={12} className="mr-1" />
                                        {dayjs(log.timestamp).tz(log.eventId.originalTimezone).format('MMM D, YYYY [at] hh:mm A')}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {log.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventLogsModal;
