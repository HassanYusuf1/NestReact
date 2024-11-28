import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Note } from '../types/Note';
import NotesDetails from './NotesDetails';

const API_URL = 'http://localhost:5215'

const NotesCreate: React.FC = () => {
  const navigate = useNavigate(); // Create a navigate function
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { noteId } = useParams<{ noteId: string }>();

useEffect(() => {
  const fetchNote = async () => {
    const id = noteId; // Fallback to a default ID (e.g., "1")
    try {
      const response = await fetch(`http://localhost:5215/api/noteapi/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch note.");
      }
      const data = await response.json();
      setNote(data);
    } catch (error) {
      setError("Failed to fetch note");
    } finally {
      setLoading(false);
    }
  };

  fetchNote();
}, [noteId]);

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
      <h2>Detailed view of the note</h2>
      <NotesDetails onNoteDeleted={handleNotesDeleted} />
    </div>
  );
};

export default NotesCreate;
