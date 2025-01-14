import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1/', // Replace with your backend URL
});

export default api;
