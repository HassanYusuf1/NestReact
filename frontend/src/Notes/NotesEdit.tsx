import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NoteForm from './NoteForm';
import { Note } from '../types/Note';
import { fetchNoteById, updateNote } from './NoteService';

const NoteEdit: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>(); // Get noteId from the URL
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch the note by ID
    const handleFetchNote = async () => {
      if (!noteId) {
        setError('No note ID provided.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const fetchedNote = await fetchNoteById(noteId); // Fetch the note
        setNote(fetchedNote);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    handleFetchNote();
  }, [noteId]); 

  const handleNoteUpdated = async (updatedNote: Note) => {
    try {
      const response = await updateNote(updatedNote); 
      console.log('Note updated successfully:', response);
      navigate(-1); 
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note');
    }
  };

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!note) return <p>No note found</p>;

  return (
    <div>
      <h2>Edit Note</h2>
      <NoteForm
        onNoteChanged={handleNoteUpdated} 
        noteId={note.noteId}
        isUpdate={true}
        initialData={note}
      />
    </div>
  );
};

export default NoteEdit;
