import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Note } from "../types/Note";
import { fetchNoteById, deleteNoteById } from "./NoteService"; // Import deleteNoteById

const NotesDetails: React.FC = () => {
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>(); //gets note id from url
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onCancel = () => { //goes back to previous page if cancel
    navigate(-1); 
  };

  const onDeleteNote = async () => { //returns after deletion
    if (!note) {
      return;
    }

    try {
      await deleteNoteById(note.noteId.toString()); //Call delete function
      navigate(-1); //Navigate back after deletion
    } catch (err) {
      setError('Failed to delete the note. Please try again.');
      console.error("Error deleting note:", err);
    }
  };

  useEffect(() => {
    const handleFetchNote = async () => {
      if (!noteId) {
        setError('No note ID provided.'); //Handles fetched the note
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNoteById(noteId);
        setNote(data); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    handleFetchNote();
  }, [noteId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; //Displays error
  }

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <div>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <Button variant="danger" onClick={onDeleteNote}>
        Delete Note
      </Button>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default NotesDetails;
