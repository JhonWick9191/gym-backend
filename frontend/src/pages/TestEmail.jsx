import React, { useState } from 'react';
import { testEmail } from '../services/api';
import Navbar from '../components/Navbar';

const TestEmail = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleTest = async (e) => {
        e.preventDefault();
        try {
            const res = await testEmail({ email });
            setMessage({ type: 'success', text: res.data.message });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Email test failed' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <h2>Test Email Service</h2>
                    <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '1rem'}}>
                        Verify if your SMTP settings in .env are working correctly.
                    </p>
                    {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                    <form onSubmit={handleTest}>
                        <div className="form-group">
                            <label>Test Email Address</label>
                            <input 
                                type="email" 
                                required 
                                placeholder="Enter email to receive test"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit">Send Test Email</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TestEmail;
