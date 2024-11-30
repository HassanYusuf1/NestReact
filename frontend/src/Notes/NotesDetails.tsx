import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Note } from "../types/Note";
import { fetchNoteById } from "./NoteService";

interface NoteDetail {
  onNoteDeleted: (note: Note) => void;
}

//Component for showing a detailed view of a note
const NotesDetails: React.FC<NoteDetail> = ({ onNoteDeleted }) => {
  const Navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>(); // Extract `noteId` from route parameters
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onCancel = () => {
    Navigate(-1); // This will navigate back one step in the history
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
        setNote(data); // Update the state with the fetched note
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
      <Button onClick={() => onNoteDeleted(note)}>Delete Note</Button>
      <Button onClick={() => onCancel()}>Cancel</Button>
    </div>
  );
};

export default NotesDetails;