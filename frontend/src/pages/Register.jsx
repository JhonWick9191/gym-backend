import React, { useState } from 'react';
import { registerAdmin } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registerAdmin(formData);
            setMessage({ type: 'success', text: res.data.message });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Registration failed' });
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Admin Register</h2>
                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Enter Name"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="Enter Email"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="Enter Password"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p style={{textAlign: 'center', marginTop: '1rem'}}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
