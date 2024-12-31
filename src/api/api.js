import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/admin/login', // Replace with your backend URL
});

export default api;
