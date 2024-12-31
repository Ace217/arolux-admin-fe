import React, { createContext, useState } from 'react';

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);

    const login = (token) => {
        setAdminToken(token);
        localStorage.setItem('adminToken', token);
    };

    const logout = () => {
        setAdminToken(null);
        localStorage.removeItem('adminToken');
    };

    return (
        <AdminContext.Provider value={{ adminToken, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
};

export default AdminProvider;
