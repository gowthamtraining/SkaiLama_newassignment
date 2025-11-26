import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Search } from 'lucide-react';
import api from '../utils/api';

const ProfileSelector = ({ selectedProfile, onSelect, profiles, onAddProfile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProfileName, setNewProfileName] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredProfiles = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProfile = async () => {
        if (!newProfileName.trim()) return;
        await onAddProfile(newProfileName);
        setNewProfileName('');
        setSearchTerm('');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="w-64 p-2.5 rounded-md bg-white border border-gray-200 text-gray-700 text-sm flex justify-between items-center cursor-pointer hover:border-gray-300 focus:outline-none focus:border-blue-500 shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedProfile ? selectedProfile.name : 'Select current profile...'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search current profile..."
                                className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto">
                        {filteredProfiles.map(profile => (
                            <div
                                key={profile._id}
                                className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center ${selectedProfile?._id === profile._id ? 'bg-indigo-500 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                                onClick={() => {
                                    onSelect(profile);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{profile.name}</span>
                                {selectedProfile?._id === profile._id && <Check size={14} />}
                            </div>
                        ))}
                        {filteredProfiles.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-400 text-center">No profiles found</div>
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-md">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="New profile name"
                                className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddProfile()}
                            />
                            <button
                                onClick={handleAddProfile}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSelector;
