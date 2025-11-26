import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Calendar } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center text-xl font-bold text-blue-400">
                    <Calendar className="mr-2" />
                    EventPlanner
                </Link>
                <div className="flex items-center space-x-4">
                    {user && <span className="text-gray-300">Welcome, {user.username}</span>}
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-400 hover:text-white transition duration-200"
                    >
                        <LogOut className="mr-1" size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
