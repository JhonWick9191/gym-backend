import React, { useState, useEffect } from 'react';
import { getAllUsers, editStudent, deleteStudent } from '../services/api';
import Navbar from '../components/Navbar';

const AllStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            setStudents(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch students');
            setLoading(false);
        }
    };

    const handleSearch = async (val) => {
        setSearchTerm(val);
        if (val.trim() === '') {
            fetchStudents();
            return;
        }
        try {
            // Search by name OR email using the general query parameter
            const res = await searchStudents({ query: val });
            setStudents(res.data.data);
        } catch (error) {
            console.error('Search failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await deleteStudent(id);
                setStudents(students.filter(s => s._id !== id));
                setMessage({ type: 'success', text: 'Student deleted successfully' });
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to delete student' });
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await editStudent(editData._id, {
                email: editData.email,
                toMonth: editData.toMonth
            });
            setMessage({ type: 'success', text: res.data.message });
            setEditData(null);
            fetchStudents();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="page-header">
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        <h2 style={{margin: 0}}>All Users</h2>
                    </div>
                    
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Search by Name or Email..." 
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>

                {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

                {/* Edit Modal / Form */}
                {editData && (
                    <div className="card" style={{ maxWidth: '400px', border: '2px solid var(--accent-color)', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1100 }}>
                        <h3>Edit Student</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    value={editData.email} 
                                    onChange={(e) => setEditData({...editData, email: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>New Expiry Date</label>
                                <input 
                                    type="date" 
                                    value={editData.toMonth ? new Date(editData.toMonth).toISOString().split('T')[0] : ''} 
                                    onChange={(e) => setEditData({...editData, toMonth: e.target.value})} 
                                    required 
                                />
                            </div>
                            <button type="submit">Update Student</button>
                            <button type="button" onClick={() => setEditData(null)} className="btn-secondary" style={{ marginTop: '0.5rem' }}>Cancel</button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading students...</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Expire Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student._id}>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{new Date(student.toMonth).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                onClick={() => setEditData(student)} 
                                                className="btn-success" 
                                                style={{ width: 'auto', marginRight: '0.5rem' }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(student._id)} 
                                                className="btn-error" 
                                                style={{ width: 'auto', backgroundColor: 'var(--error-color)' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && <p style={{ textAlign: 'center', padding: '1rem' }}>No students found.</p>}
                    </div>
                )}
            </div>
        </>
    );
};

export default AllStudents;
