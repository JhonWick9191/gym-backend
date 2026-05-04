import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real app, we'd clear the cookie here if possible or call a logout API
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">
                GymAdmin
            </Link>
            <div className="navbar-links">
                <Link to="/create-user">Add User</Link>
                <Link to="/all-students">All Users</Link>
                <a href="#" onClick={handleLogout}>Logout</a>
            </div>
        </nav>
    );
};

export default Navbar;
