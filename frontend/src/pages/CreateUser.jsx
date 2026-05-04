import React, { useState } from 'react';
import { createUser } from '../services/api';
import Navbar from '../components/Navbar';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', monthlyFee: '', fromMonth: '', toMonth: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createUser(formData);
            setMessage({ type: 'success', text: res.data.message });
            setFormData({ name: '', email: '', monthlyFee: '', fromMonth: '', toMonth: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to create user' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h2>Add New Student</h2>
                    {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={formData.name} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={formData.email} required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Monthly Fee</label>
                            <input type="number" value={formData.monthlyFee} required onChange={(e) => setFormData({...formData, monthlyFee: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>From Month</label>
                            <input type="date" value={formData.fromMonth} required onChange={(e) => setFormData({...formData, fromMonth: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>To Month</label>
                            <input type="date" value={formData.toMonth} required onChange={(e) => setFormData({...formData, toMonth: e.target.value})} />
                        </div>
                        <button type="submit">Create User</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateUser;
