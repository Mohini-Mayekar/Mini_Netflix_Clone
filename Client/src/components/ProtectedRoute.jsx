import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.accessToken) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
