import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Note } from "../types/Note";

interface NoteDetail {
  onNoteDeleted: (note: Note) => void;
}

// Component for showing a detailed view of a note
const NotesDetails: React.FC<NoteDetail> = ({ onNoteDeleted }) => {
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>(); // Extract `noteId` from route parameters
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Replace with your actual API base URL
  const API_URL = "http://localhost:5215";

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) {
        setError("Invalid note ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/noteapi/${noteId}`); // default Get
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setNote(data);
      } catch (error) {
        setError("Failed to fetch note");
        console.error("There was a problem with the fetch operation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
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
    </div>
  );
};

export default NotesDetails;