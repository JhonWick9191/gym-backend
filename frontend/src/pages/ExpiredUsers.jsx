import React, { useState, useEffect } from 'react';
import { getExpiredUsers, updateFee } from '../services/api';
import Navbar from '../components/Navbar';

const ExpiredUsers = () => {
    const [users, setUsers] = useState([]);
    const [renewDate, setRenewDate] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getExpiredUsers();
            setUsers(res.data.data);
        } catch (error) {
            console.error('Failed to fetch expired users');
        }
    };

    const handleRenew = async (e) => {
        e.preventDefault();
        try {
            const res = await updateFee(selectedUser, { newToMonth: renewDate });
            setMessage({ type: 'success', text: res.data.message });
            setSelectedUser(null);
            setRenewDate('');
            fetchUsers();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <h2>Expired Users</h2>
                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                
                {selectedUser && (
                    <div className="card" style={{maxWidth: '400px'}}>
                        <h3>Renew Membership</h3>
                        <form onSubmit={handleRenew}>
                            <div className="form-group">
                                <label>New Expiry Date</label>
                                <input type="date" required value={renewDate} onChange={(e) => setRenewDate(e.target.value)} />
                            </div>
                            <button type="submit">Update Fee</button>
                            <button type="button" onClick={() => setSelectedUser(null)} className="btn-secondary" style={{marginTop: '0.5rem'}}>Cancel</button>
                        </form>
                    </div>
                )}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Expired On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.toMonth).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => setSelectedUser(user._id)} className="btn-success" style={{width: 'auto'}}>Renew</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ExpiredUsers;
