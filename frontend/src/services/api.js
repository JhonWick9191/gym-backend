import axios from 'axios';

// Set the base URL for the backend API
const API_URL = 'http://localhost:5000/api/v1';

// Create an axios instance with default settings
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Required to send/receive cookies
});

// Admin API calls
export const registerAdmin = (adminData) => api.post('/admin/register', adminData);
export const loginAdmin = (credentials) => api.post('/admin/login', credentials);

// User/Student API calls
export const createUser = (userData) => api.post('/users/create-user', userData);
export const getAllUsers = () => api.get('/users');
export const searchStudents = (query) => api.get('/users/search', { params: query });
export const getExpiredUsers = () => api.get('/users/expired');
export const getExpiringThisMonth = () => api.get('/users/expiring-this-month');
export const updateFee = (id, data) => api.put(`/users/update-fee/${id}`, data);
export const editStudent = (id, data) => api.put(`/users/${id}`, data);
export const deleteStudent = (id) => api.delete(`/users/${id}`);
export const notifyExpiredUsers = () => api.post('/users/notify-expired');
export const testEmail = (emailData) => api.post('/users/test-email', emailData);

export default api;
