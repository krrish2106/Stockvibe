import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const Modal = ({ show, handleClose, handleChange, handleSubmit, newElement }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Timeline Element</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="date"
            value={newElement.date}
            onChange={handleChange}
            placeholder="Date in YYYY-MM-DD"
            className="block w-full p-2 mb-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="title"
            value={newElement.title}
            onChange={handleChange}
            placeholder="Title"
            className="block w-full p-2 mb-2 border border-gray-300 rounded"
            required
          />
          <textarea
            name="description"
            value={newElement.description}
            onChange={handleChange}
            placeholder="Description"
            className="block w-full p-2 mb-2 border border-gray-300 rounded"
            required
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleClose} className="p-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export function Note({ stockId, notes, setNotes }) {
  const [showModal, setShowModal] = useState(false);
  const [newElement, setNewElement] = useState({
    date: '',
    title: '',
    description: ''
  });

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewElement({ date: '', title: '', description: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewElement(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/stocks/${stockId}/notes`,
        newElement,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setNotes(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to add note', error);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/stocks/${stockId}/notes/${noteId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    setNotes(response.data); 
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <VerticalTimeline>
        {notes.map(note => (
          <VerticalTimelineElement
            key={note._id}
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#f2f2f2', color: '#000' }}
            contentArrowStyle={{ borderRight: '7px solid #f2f2f2' }}
            date={note.date}
            dateClassName="text-blue-500 font-semibold"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            icon={<FormatListBulletedIcon />}
            lineColor='rgb(33, 150, 243)'
          >
            <h3 className="vertical-timeline-element-title">{note.title}</h3>
            <p>{note.description}</p>
            <button
              onClick={() => handleDelete(note._id)}
              className="mt-2 p-2 rounded flex items-center text-black"
            >
              <DeleteIcon className="mr-2" /> Delete
            </button>
          </VerticalTimelineElement>
        ))}
        <VerticalTimelineElement
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          icon={<StarIcon />}
        />
      </VerticalTimeline>

      <div className="flex justify-center mt-4">
        <button onClick={handleAddClick} className="flex items-center p-2 bg-green-500 text-white rounded shadow-lg">
          <AddIcon className="mr-2" /> Add Element
        </button>
      </div>

      <Modal
        show={showModal}
        handleClose={handleCloseModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        newElement={newElement}
      />
    </div>
  );
}
