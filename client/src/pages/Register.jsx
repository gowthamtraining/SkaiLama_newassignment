import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', defaultTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { username, password, defaultTimezone } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Register</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1">Default Timezone</label>
                        <input
                            type="text"
                            name="defaultTimezone"
                            value={defaultTimezone}
                            onChange={onChange}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-500"
                            placeholder="e.g. America/New_York"
                        />
                        <p className="text-xs text-gray-500 mt-1">Detected: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                    </div>
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Already have an account? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
