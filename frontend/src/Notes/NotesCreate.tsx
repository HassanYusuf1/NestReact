import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from './NoteForm';
import { Note } from '../types/Note';

const API_URL = 'http://localhost:5215'

const NotesCreate: React.FC = () => {
  const navigate = useNavigate(); // Create a navigate function

  const handleNoteCreated = async (note: Note) => {
    try {
      const response = await fetch(`${API_URL}/api/NoteAPI/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('note created successfully:', data);
      navigate('/notes'); // Navigate back after successful creation
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
  
  return (
    <div>
      <h2>Create New note</h2>
      <NoteForm onNoteChanged={handleNoteCreated} />
    </div>
  );
};

export default NotesCreate;
