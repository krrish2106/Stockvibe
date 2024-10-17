import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ProtectedRoute = ({ children }) => {
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsValid(false);
                return;
            }

            try {
                const response = await axios.post(`${API_BASE_URL}/user/verifytoken`,{},{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsValid(response.data.valid);
            } catch (error) {
                setIsValid(false);
            }
        };

        verifyToken();
    }, []);

    if (isValid === null) {
        return <div>Loading...</div>;
    }

    if (!isValid) {
        return <Navigate to="/signin" />;
    }

    return children;
};
