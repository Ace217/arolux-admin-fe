import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/admin/login', // Replace with your backend URL
});

export default api;
