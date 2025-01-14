import axios from 'axios';

const api = axios.create({
    baseURL: 'https://3.137.118.155:8000/api/v1/', // Replace with your backend URL
});

export default api;
