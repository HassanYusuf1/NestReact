import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from './NoteForm';
import { Note } from '../types/Note';
import { createNote } from '../Notes/NoteService';
import { formatTimeAgo } from '../utils/dateUtils'; //import help function from dateutils

const NotesCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formattedTime, setFormattedTime] = useState<string | null>(null); 

  const handleNoteCreated = async (note: Note) => {
    try {
      const createdNote = await createNote(note);

      const formatted = formatTimeAgo(createdNote.uploadDate);
      setFormattedTime(formatted);

      navigate('/notes/mypage'); 
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div>
      <h2>Create New Note</h2>
      <NoteForm onNoteChanged={handleNoteCreated} />
      {formattedTime && <p>Note uploaded: {formattedTime}</p>}
    </div>
  );
};

export default NotesCreate;
