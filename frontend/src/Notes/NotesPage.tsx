import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllNotes } from "./NoteService";
import { Note } from "../types/Note";
import { Button } from "react-bootstrap";
import { formatTimeAgo } from "../utils/dateUtils";
import CommentTableNote from "../Comment/CommentTableNote";
import '../layout.css';

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => { 
      try {
        setLoading(true);
        const data = await fetchAllNotes(); //uses method which fetches all notes in database from service
        setNotes(data);
      } catch (err) {
        setError("Could not load notes. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>{error}</p>; //displays error if error
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Notes Feed</h1>
      <div className="d-flex flex-column align-items-center">
        {notes.map((note) => ( //Uses .map() to retrieve note attributes for html
          <div key={note.noteId} className="mb-4" style={{ width: "100%", maxWidth: "800px" }}>
            <div className="card shadow-sm" style={{ minHeight: "300px" }}>
              <div className="card-body">
                <h4 className="card-title">{note.title}</h4>
                <p className="card-text">{note.content}</p>
                <p className="card-subtitle mb-2 text-muted">
                  Uploaded: {formatTimeAgo(note.uploadDate)}
                </p>
                <div className="d-flex justify-content-start gap-1">
                  <Button
                    onClick={() => navigate(`/edit/${note.noteId}`, { state: { from: '/notes' } })} //Action buttons
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => navigate(`/NotesDetails/${note.noteId}`)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="card-footer p-3">
                <CommentTableNote note={note} noteId={note.noteId} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
