import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, Search, X } from 'lucide-react';

const MultiProfileSelector = ({ selectedProfiles, onSelect, profiles, onAddProfile }) => {
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
        const newProfile = await onAddProfile(newProfileName);
        if (newProfile) {
            onSelect([...selectedProfiles, newProfile]);
        }
        setNewProfileName('');
        setSearchTerm('');
    };

    const toggleProfile = (profile) => {
        const isSelected = selectedProfiles.some(p => p._id === profile._id);
        let newSelection;
        if (isSelected) {
            newSelection = selectedProfiles.filter(p => p._id !== profile._id);
        } else {
            newSelection = [...selectedProfiles, profile];
        }
        onSelect(newSelection);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="w-full p-2.5 rounded-md bg-indigo-500 text-white text-sm flex justify-between items-center cursor-pointer hover:bg-indigo-600 shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>
                    {selectedProfiles.length === 0
                        ? 'Select profiles...'
                        : `${selectedProfiles.length} profiles selected`}
                </span>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search profiles..."
                                className="w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-48 overflow-y-auto">
                        {(() => {
                            const selectedIds = new Set(selectedProfiles.map(p => p._id));

                            return filteredProfiles.map(profile => {
                                const isSelected = selectedIds.has(profile._id);
                                return (
                                    <div
                                        key={profile._id}
                                        className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center ${isSelected ? 'bg-indigo-500 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                                        onClick={() => toggleProfile(profile)}
                                    >
                                        <div className="flex items-center">
                                            {isSelected && <Check size={14} className="mr-2" />}
                                            <span className={!isSelected ? 'ml-6' : ''}>{profile.name}</span>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                        {filteredProfiles.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-400 text-center">No profiles found</div>
                        )}
                    </div>

                    <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-md">
                        <div className="flex items-center cursor-pointer text-gray-600 hover:text-indigo-600" onClick={() => { }}>
                            <div className="flex space-x-2 w-full">
                                <input
                                    type="text"
                                    placeholder="New profile name"
                                    className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-blue-500"
                                    value={newProfileName}
                                    onChange={(e) => setNewProfileName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddProfile();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddProfile}
                                    className="flex items-center bg-transparent text-gray-600 hover:text-indigo-600 px-2 py-1.5 rounded-md text-xs font-medium transition-colors"
                                >
                                    <Plus size={14} className="mr-1" /> Add Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiProfileSelector;
