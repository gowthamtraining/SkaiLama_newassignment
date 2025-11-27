import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                <Dashboard />
                            </>
                        }
                    />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
