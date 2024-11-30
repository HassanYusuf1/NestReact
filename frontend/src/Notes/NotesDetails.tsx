import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Note } from "../types/Note";
import { fetchNoteById } from "./NoteService";

interface NoteDetail {
  onNoteDeleted: (note: Note) => void;
}

const NotesDetails: React.FC<NoteDetail> = ({ onNoteDeleted }) => {
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>(); 
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onCancel = () => {
    navigate(-1); 
  };

  const onDeleteNote = (note: Note) => {
    navigate(-1); 
  };

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
    return <div>Error: {error}</div>;
  }

  if (!note) {
    return <div>Note not found</div>;
  }

  return (
    <div>
      <p>{note.title}</p>
      <p>{note.content}</p>
      <Button onClick={() => onDeleteNote(note)}>Delete Note</Button>
      <Button onClick={() => onCancel()}>Cancel</Button>
    </div>
  );
};

export default NotesDetails;
