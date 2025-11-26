import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Navbar = () => {
    
    return (
        <nav className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center text-xl font-bold text-blue-400">
                    <Calendar className="mr-2" />
                    EventPlanner
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
