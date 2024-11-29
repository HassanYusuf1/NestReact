import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NoteForm from './NoteForm';
import { Note } from '../types/Note';
import { fetchNoteById } from './NoteService';

const API_URL = 'http://localhost:5215'

const NoteUpdatePage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>(); // Get noteId from the URL
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleFetchNote = async () => {
      if (!noteId) {
        setError('No note ID provided.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNoteById(noteId);
        setNote(data); // Update the state with the fetched note
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    handleFetchNote();
  }, [noteId]);

  const handleNoteUpdated = async (note: Note) => {
    try {
      const response = await fetch(`${API_URL}/api/NoteAPI/edit/${note.noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Note updated successfully:', data);
      navigate('/notes'); // Navigate back after successful creation
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!note) return <p>No note found</p>;
  
  return (
    <div>
      <h2>Update Note</h2>
      <NoteForm onNoteChanged={handleNoteUpdated} noteId={note.noteId} isUpdate={true} initialData={note} />
    </div>
  );
};

export default NoteUpdatePage;