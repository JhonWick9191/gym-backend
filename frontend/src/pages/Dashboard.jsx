import React, { useState } from 'react';
import { notifyExpiredUsers } from '../services/api';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleNotify = async () => {
        try {
            const res = await notifyExpiredUsers();
            setMessage({ type: 'success', text: res.data.message });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to trigger notifications' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div style={{textAlign: 'center', marginBottom: '3rem'}}>
                    <h2 style={{marginTop: '0.5rem'}}>Gym Management Dashboard</h2>
                </div>
                
                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                
                <div className="dashboard-grid">
                    <Link to="/all-students" className="stat-card">
                        <h3>All Students</h3>
                        <p>View, edit, search and delete students</p>
                    </Link>

                    <Link to="/create-user" className="stat-card">
                        <h3>Add User</h3>
                        <p>Register a new student</p>
                    </Link>
                    
                    <Link to="/expired" className="stat-card">
                        <h3>Expired Users</h3>
                        <p>View users whose fees have passed</p>
                    </Link>
                    
                    <div className="stat-card" style={{cursor: 'pointer'}} onClick={handleNotify}>
                        <h3>Notify Expired</h3>
                        <p>Send emails to all expired users</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
