import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import api from '../utils/api';
import MultiProfileSelector from './MultiProfileSelector';
import { X, MapPin, Save } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditEventModal = ({ event, onClose, onEventUpdated, profiles, onAddProfile }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        timezone: '',
    });
    const [selectedProfiles, setSelectedProfiles] = useState([]);

    useEffect(() => {
        if (event) {
            const tz = event.originalTimezone || dayjs.tz.guess();

            const start = dayjs(event.startTime).tz(tz).format('YYYY-MM-DDTHH:mm');
            const end = dayjs(event.endTime).tz(tz).format('YYYY-MM-DDTHH:mm');

            setFormData({
                title: event.title,
                description: event.description || '',
                startTime: start,
                endTime: end,
                timezone: tz,
            });

            if (event.profiles && event.profiles.length > 0) {
                const firstProfile = event.profiles[0];
                if (typeof firstProfile === 'string') {
                    const selected = profiles.filter(p => event.profiles.includes(p._id));
                    setSelectedProfiles(selected);
                } else {
                    setSelectedProfiles(event.profiles);
                }
            }
        }
    }, [event, profiles]);

    const { title, description, startTime, endTime, timezone: formTimezone } = formData;

    const handleTimezoneChange = (e) => {
        const newTimezone = e.target.value;
        const newStartTime = startTime ? dayjs.tz(startTime, formTimezone).tz(newTimezone).format('YYYY-MM-DDTHH:mm') : '';
        const newEndTime = endTime ? dayjs.tz(endTime, formTimezone).tz(newTimezone).format('YYYY-MM-DDTHH:mm') : '';
        
        setFormData({
            ...formData,
            timezone: newTimezone,
            startTime: newStartTime,
            endTime: newEndTime
        });
    };

    const handleStartDateChange = (e) => {
        const newDate = e.target.value;
        const time = startTime ? dayjs(startTime).format('HH:mm') : '09:00';
        setFormData({ ...formData, startTime: `${newDate}T${time}` });
    };

    const handleStartTimeChange = (e) => {
        const newTime = e.target.value;
        const date = startTime ? dayjs(startTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
        setFormData({ ...formData, startTime: `${date}T${newTime}` });
    };

    const handleEndDateChange = (e) => {
        const newDate = e.target.value;
        const time = endTime ? dayjs(endTime).format('HH:mm') : '09:00';
        setFormData({ ...formData, endTime: `${newDate}T${time}` });
    };

    const handleEndTimeChange = (e) => {
        const newTime = e.target.value;
        const date = endTime ? dayjs(endTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
        setFormData({ ...formData, endTime: `${date}T${newTime}` });
    };

    const onSubmit = async e => {
        e.preventDefault();

        if (selectedProfiles.length === 0) {
            alert('Please select at least one profile');
            return;
        }

        const startUtc = dayjs.tz(startTime, formTimezone).utc().format();
        const endUtc = dayjs.tz(endTime, formTimezone).utc().format();

        try {
            await api.put(`/events/${event._id}`, {
                title,
                description,
                startTime: startUtc,
                endTime: endUtc,
                originalTimezone: formTimezone,
                profileIds: selectedProfiles.map(p => p._id)
            });

            onClose();
        } catch (err) {
            console.error('Error updating event', err);
            alert('Failed to update event');
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

    const startDate = startTime ? dayjs(startTime).format('YYYY-MM-DD') : '';
    const startTimeOnly = startTime ? dayjs(startTime).format('HH:mm') : '09:00';
    const endDate = endTime ? dayjs(endTime).format('YYYY-MM-DD') : '';
    const endTimeOnly = endTime ? dayjs(endTime).format('HH:mm') : '09:00';
    const isSubmitDisabled = startTime && endTime && dayjs(startTime).isAfter(dayjs(endTime));

    if (!event) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Edit Event</h3>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Profiles</label>
                        <MultiProfileSelector
                            selectedProfiles={selectedProfiles}
                            onSelect={setSelectedProfiles}
                            profiles={profiles}
                            onAddProfile={onAddProfile}
                        />
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

                    <div className="form-group">
                        <label className="form-label">Timezone</label>
                        <div className="relative">
                            <select
                                className="input-field pl-10"
                                value={formTimezone}
                                onChange={handleTimezoneChange}
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

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className={`btn ${isSubmitDisabled ? 'btn-disabled' : 'btn-primary'}`}
                        >
                            <Save size={18} className="mr-2" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventModal;
