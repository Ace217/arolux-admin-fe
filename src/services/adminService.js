import api from "../../src/api/api";

// Admin Login
export const loginAdmin = async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    return response.data; // Returns token and message
};


// Create Admin
export const createAdmin = async (formData) => {
    const response = await api.post('/admin/account', formData);
    return response.data; // Returns the response from the API (e.g., success message, created admin data)
};
