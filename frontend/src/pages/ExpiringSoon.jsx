import React, { useState, useEffect } from 'react';
import { getExpiringThisMonth } from '../services/api';
import Navbar from '../components/Navbar';

const ExpiringSoon = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getExpiringThisMonth();
                setUsers(res.data.data);
            } catch (error) {
                console.error('Failed to fetch expiring users');
            }
        };
        fetchUsers();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <h2>Expiring This Month</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Expiring On</th>
                                <th>Monthly Fee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.toMonth).toLocaleDateString()}</td>
                                    <td>₹{user.monthlyFee}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ExpiringSoon;
