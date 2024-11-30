import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Note } from '../types/Note';
import NotesDetails from './NotesDetails';
import { fetchNoteByIdForDisplay, deleteNoteById } from './NoteService';

const NotesCreate: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate(); // Create a navigate function
  const [, setNote] = useState<Note | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) {
        setError('No note ID provided.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNoteByIdForDisplay(noteId);
        setNote(data); // Update state with fetched note
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch note.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]); // Fetch note when the component mounts or when noteId changes

  const handleNotesDeleted = async (note: Note) => {
    const confirmDelete = true; // Automatically set to true to bypass the confirmation dialog
    if (confirmDelete && note) {
      try {
        await deleteNoteById(note.noteId.toString());
        navigate(-1); // Navigate back to the home page or another appropriate page
      } catch (error) {
        console.error('Error deleting note:', error);
        setError('Failed to delete note.');
      }
    }
  };

  return (
    <div>
      <h2>Are you sure you want to delete this note?</h2>
      <NotesDetails onNoteDeleted={handleNotesDeleted} />
    </div>
  );
};

export default NotesCreate;
