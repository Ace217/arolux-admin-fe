import api from "../../src/api/api";

// Admin Login
export const loginAdmin = async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    return response.data; // Returns token and message
};
