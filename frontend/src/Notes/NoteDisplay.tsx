import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Note } from '../types/Note';
import NotesDetails from './NotesDetails';
import { fetchNoteByIdForDisplay } from './NoteService';

const API_URL = 'http://localhost:5215'

const NotesCreate: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate(); // Create a navigate function
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

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

  useEffect(() => {
    fetchNote();
  }, [noteId]); // Fetch note when the component mounts or when noteId changes

  const handleNotesDeleted = async (note: Note) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the note "${note?.title}"?`);
    if (confirmDelete && note) {
      try {
        const response = await fetch(`${API_URL}/api/NoteAPI/delete/${note.noteId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete the note.");
        }

        alert("Note deleted successfully.");
        navigate("/"); // Navigate back to the home page or another appropriate page
      } catch (error) {
        console.error("Error deleting note:", error);
        setError("Failed to delete note.");
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
