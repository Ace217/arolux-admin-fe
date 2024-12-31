import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const ProtectedRoute = ({ children }) => {
    const { adminToken } = useContext(AdminContext);

    return adminToken ? children : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
