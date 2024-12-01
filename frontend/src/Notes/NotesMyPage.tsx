import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchAllNotes } from "./NoteService";
import { Note } from "../types/Note";
import { Button } from "react-bootstrap";
import { formatTimeAgo } from "../utils/dateUtils";
import CommentTableNote from "../Comment/CommentTableNote"; //Import the CommentTableNote component
import '../css/layout.css';

const NotesMyPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); //To get the source of the current page

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
      <h2 className="spaced-heading">My Notes</h2>
      <div className="row">
        {notes.map((note) => ( //maps the note using .map() to be able to retrieve note attributes
          <div key={note.noteId} className="col-12 col-md-6 mb-4">
            <div className="card shadow-sm" style={{ minHeight: "300px" }}>
              <div className="card-body">
                <h4 className="card-title">{note.title}</h4>
                <p className="card-text">{note.content}</p>
                <p className="card-subtitle mb-2 text-muted">
                  Uploaded: {formatTimeAgo(note.uploadDate)}
                </p>
                <div className="d-flex justify-content-start gap-1"> 
                  <Button
                    onClick={() =>
                      navigate(`/edit/${note.noteId}`, {
                        state: { source: location.pathname },
                      })
                    }
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() =>
                      navigate(`/NotesDetails/${note.noteId}`, {
                        state: { source: location.pathname },
                      })
                    }
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
      <div className="mt-5 text-center">
        <button
          className="btn btn-primary btn-lg rounded-pill shadow-sm"
          onClick={() => navigate("/notescreate", { state: { source: location.pathname } })}
        >
           Upload New Note
        </button>
      </div>
    </div>
  );
};

export default NotesMyPage;
