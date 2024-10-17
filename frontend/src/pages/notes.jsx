import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Note } from '../components/note';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const Notes = () => {
    const { stockId } = useParams();
    const [notes, setNotes] = useState([]);
    const [stock, setStock] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${API_BASE_URL}/stocks/${stockId}/notes`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
            if (response.data && response.data[1]) {
                setNotes(response.data[0]);
                setStock(response.data[1].stockName);
            } else {
                window.alert("stock not found")
                navigate('/dashboard')
            }
        })
        .catch(err => {
            console.error('Failed to fetch notes', err);
            window.alert("stock not found")
            navigate('/dashboard')
        });
    }, [stockId]);

    return (
        <div>
            <div className="text-center text-2xl text-gray-800 mt-8 font-semibold">{stock}</div>
            <Note stockId={stockId} notes={notes} setNotes={setNotes} />
        </div>
    );
};
