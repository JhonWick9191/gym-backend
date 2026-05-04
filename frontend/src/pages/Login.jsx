import React, { useState } from 'react';
import { loginAdmin } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginAdmin(formData);
            setMessage({ type: 'success', text: res.data.message });
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Login failed' });
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Admin Login</h2>
                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                <form onSubmit={handleSubmit}>
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
                    <button type="submit">Login</button>
                </form>
                <p style={{textAlign: 'center', marginTop: '1rem'}}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
