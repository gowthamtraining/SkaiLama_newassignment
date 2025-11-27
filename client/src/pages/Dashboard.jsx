import React, { useEffect, useState } from 'react';
import EventForm from '../components/EventForm';
import ProfileSelector from '../components/ProfileSelector';
import EditEventModal from '../components/EditEventModal';
import EventLogsModal from '../components/EventLogsModal';
import dayjs from 'dayjs';
import { Trash2, Clock, Edit2, FileText } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { useProfiles } from '../hooks/useProfiles';

const Dashboard = () => {
    const [currentProfile, setCurrentProfile] = useState(null);
    const [displayTimezone, setDisplayTimezone] = useState(dayjs.tz.guess());
    const [editingEvent, setEditingEvent] = useState(null);
    const [viewingLogsEvent, setViewingLogsEvent] = useState(null);

    const { profiles, addProfile } = useProfiles();
    const { events, fetchEvents, deleteEvent } = useEvents(currentProfile);
    console.log(profiles,"profiles")
    useEffect(() => {
        if (profiles.length > 0 && !currentProfile) {
            setCurrentProfile(profiles[0]);
        }
    }, [profiles, currentProfile]);

    const handleAddProfile = async (name) => {
        const newProfile = await addProfile(name);
        if (newProfile) {
            setCurrentProfile(newProfile);
            return newProfile;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(id);
        }
    };

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

    useEffect(() => {
        fetchEvents();
    }, [currentProfile]);

    return (
        <div className="container-main">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Event Management</h1>
                    <p className="dashboard-subtitle">Create and manage events across multiple timezones</p>
                </div>
                <div>
                    <ProfileSelector
                        selectedProfile={currentProfile}
                        onSelect={setCurrentProfile}
                        profiles={profiles}
                        onAddProfile={handleAddProfile}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <EventForm
                        onEventAdded={fetchEvents}
                        currentProfile={currentProfile}
                        profiles={profiles}
                        onAddProfile={handleAddProfile}
                    />
                </div>
                <div className="card">
                    <h3 className="card-title">Events</h3>

                    <div className="form-group">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">View in Timezone</label>
                        <select
                            value={displayTimezone}
                            onChange={(e) => setDisplayTimezone(e.target.value)}
                            className="input-field"
                        >
                            {timezones.map(tz => (
                                <option key={tz} value={tz}>{tz}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        {events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <p>No events found</p>
                            </div>
                        ) : (
                            events.filter(event => event.profiles.map((i)=>i._id).includes(currentProfile._id)).map(event => (
                                <div key={event._id} className="event-card">
                                    <div className="event-card-header">
                                        <div className="flex items-center mb-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex gap-1">
                                                {event.profiles.map((itm, index) => (
                                                    <h3 key={itm._id || index} className="event-card-title"> {itm.name}{index === event.profiles.length - 1 ? '' : ', '} </h3>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="event-info-row">
                                                <div className="icon-wrapper">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="event-date">Start: {dayjs(event.startTime).tz(displayTimezone).format('MMM D, YYYY')}</p>
                                                    <p className="event-time">
                                                        <Clock size={12} className="mr-1" />
                                                        {dayjs(event.startTime).tz(displayTimezone).format('h:mm A')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="event-info-row">
                                                <div className="icon-wrapper">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="event-date">End: {dayjs(event.endTime).tz(displayTimezone).format('MMM D, YYYY')}</p>
                                                    <p className="event-time">
                                                        <Clock size={12} className="mr-1" />
                                                        {dayjs(event.endTime).tz(displayTimezone).format('h:mm A')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="event-meta">
                                        <p className="event-meta-text">
                                            Created: {dayjs(event.createdAt).tz(displayTimezone).format('MMM D, YYYY [at] h:mm A')}
                                        </p>
                                        <p className="event-meta-text">
                                            Updated: {dayjs(event.updatedAt).tz(displayTimezone).format('MMM D, YYYY [at] h:mm A')}
                                        </p>
                                    </div>

                                    <div className="event-actions">
                                        <button
                                            onClick={() => setEditingEvent(event)}
                                            className="flex-1 btn btn-secondary text-sm"
                                        >
                                            <Edit2 size={14} className="mr-2" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setViewingLogsEvent(event)}
                                            className="flex-1 btn btn-secondary text-sm"
                                        >
                                            <FileText size={14} className="mr-2" />
                                            View Logs
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition duration-200"
                                            title="Delete Event"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onEventUpdated={() => {
                        fetchEvents();
                        setEditingEvent(null);
                    }}
                    profiles={profiles}
                    onAddProfile={handleAddProfile}
                />
            )}

            {viewingLogsEvent && (
                <EventLogsModal
                    event={viewingLogsEvent}
                    onClose={() => setViewingLogsEvent(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
