import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from './NoteForm';
import { Note } from '../types/Note';
import { createNote } from '../Notes/NoteService';
import { formatTimeAgo } from '../utils/dateUtils'; // Importer hjelpefunksjonen

const NotesCreate: React.FC = () => {
  const navigate = useNavigate();
  const [formattedTime, setFormattedTime] = useState<string | null>(null); // State for formatert tid

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
      {formattedTime && <p>Note uploaded: {formattedTime}</p>} {/* Vis formatert tid */}
    </div>
  );
};

export default NotesCreate;
