import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import api from '../utils/api';
import MultiProfileSelector from './MultiProfileSelector';
import { Plus, MapPin } from 'lucide-react';

const EventForm = ({ onEventAdded, currentProfile, profiles, onAddProfile }) => {
    const [formData, setFormData] = useState({
        title: 'New Event',
        description: '',
        startTime: '',
        endTime: '',
        timezone: dayjs.tz.guess(),
    });
    const [selectedProfiles, setSelectedProfiles] = useState([]);

    useEffect(() => {
        if (currentProfile && selectedProfiles.length === 0) {
            setSelectedProfiles([currentProfile]);
        }
    }, [currentProfile]);

    const { title, description, startTime, endTime, timezone } = formData;

    const startDate = startTime ? dayjs(startTime).format('YYYY-MM-DD') : '';
    const startTimeOnly = startTime ? dayjs(startTime).format('HH:mm') : '09:00';
    const endDate = endTime ? dayjs(endTime).format('YYYY-MM-DD') : '';
    const endTimeOnly = endTime ? dayjs(endTime).format('HH:mm') : '09:00';

    const handleStartDateChange = (e) => {
        setFormData({ ...formData, startTime: `${e.target.value}T${startTimeOnly}` });
    };

    const handleStartTimeChange = (e) => {
        const date = startDate || dayjs().format('YYYY-MM-DD');
        setFormData({ ...formData, startTime: `${date}T${e.target.value}` });
    };

    const handleEndDateChange = (e) => {
        setFormData({ ...formData, endTime: `${e.target.value}T${endTimeOnly}` });
    };

    const handleEndTimeChange = (e) => {
        const date = endDate || dayjs().format('YYYY-MM-DD');
        setFormData({ ...formData, endTime: `${date}T${e.target.value}` });
    };

    const onSubmit = async e => {
        e.preventDefault();

        if (selectedProfiles.length === 0) {
            alert('Please select at least one profile');
            return;
        }

        const startUtc = dayjs.tz(startTime, timezone).utc().format();
        const endUtc = dayjs.tz(endTime, timezone).utc().format();

        try {
            await api.post('/events', {
                title,
                description,
                startTime: startUtc,
                endTime: endUtc,
                originalTimezone: timezone,
                profileIds: selectedProfiles.map(p => p._id)
            });

            setFormData({
                title: 'New Event',
                description: '',
                startTime: '',
                endTime: '',
                timezone: dayjs.tz.guess(),
            });

            onEventAdded();
        } catch (err) {
            console.error('Error adding event', err);
            alert('Failed to add event');
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

    const isSubmitDisabled = startTime && endTime && dayjs(startTime).isAfter(dayjs(endTime));

    return (
        <form onSubmit={onSubmit} className="card">
            <h3 className="card-title">Create New Event</h3>
            <div className="form-group">
                <label className="form-label">Profiles</label>
                <MultiProfileSelector
                    selectedProfiles={selectedProfiles}
                    onSelect={setSelectedProfiles}
                    profiles={profiles}
                    onAddProfile={onAddProfile}
                />
            </div>
             <div className="form-group">
                <label className="form-label">Timezone</label>
                <div className="relative">
                    <select
                        className="input-field pl-10"
                        value={timezone}
                        onChange={(e) => {
                            const newTimezone = e.target.value;
                            const newStartTime = startTime ? dayjs.tz(startTime, timezone).tz(newTimezone).format('YYYY-MM-DDTHH:mm') : '';
                            const newEndTime = endTime ? dayjs.tz(endTime, timezone).tz(newTimezone).format('YYYY-MM-DDTHH:mm') : '';

                            setFormData({
                                ...formData,
                                timezone: newTimezone,
                                startTime: newStartTime,
                                endTime: newEndTime
                            });
                        }}
                    >
                        {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={16} className="text-gray-400" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="form-label">Start Date</label>
                    <input
                        type="date"
                        className="input-field"
                        value={startDate}
                        min={dayjs().format('YYYY-MM-DD')}
                        onChange={handleStartDateChange}
                        required
                    />
                </div>
                <div>
                    <label className="form-label">Start Time</label>
                    <input
                        type="time"
                        className="input-field"
                        value={startTimeOnly}
                        min={startDate === dayjs().format('YYYY-MM-DD') ? dayjs().format('HH:mm') : undefined}
                        onChange={handleStartTimeChange}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="form-label">End Date</label>
                    <input
                        type="date"
                        className="input-field"
                        value={endDate}
                        min={startTime ? dayjs(startTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')}
                        onChange={handleEndDateChange}
                        required
                    />
                </div>
                <div>
                    <label className="form-label">End Time</label>
                    <input
                        type="time"
                        className="input-field"
                        value={endTimeOnly}
                        min={endDate === startDate ? startTimeOnly : undefined}
                        onChange={handleEndTimeChange}
                        required
                    />
                </div>
            </div>

           

            <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full btn ${isSubmitDisabled ? 'btn-disabled' : 'btn-primary'}`}
            >
                <Plus size={18} className="mr-2" />
                Create Event
            </button>
        </form>
    );
};

export default EventForm;
