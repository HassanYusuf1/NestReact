import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Note } from '../types/Note';
import { useNavigate } from 'react-router-dom';
import { fetchAllNotes } from './NoteService';
import CommentTableNote from '../Comment/CommentTableNote';
import { formatTimeAgo } from '../utils/dateUtils';

const NotesPage: React.FC = () => {
  const navigate = useNavigate(); // Create a navigate function
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllNotes();
      const sortedNotes = data.sort((a, b) => b.noteId - a.noteId);
      setNotes(sortedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="container-custom">
      <h1 className="text-center">Notes</h1>
      <div className="row flex-column align-items-center">
        {notes.length === 0 ? (
          <p className="text-center">No notes found.</p>
        ) : (
          notes.map(note => (
            <div key={note.noteId} className="col-12 mb-4"> {/* Single column per card */}
              <div className="card mb-4 shadow-sm note-card">
                <div className="card-body">
                  <h4 className="note-title">{note.title}</h4>
                  <p className="note-content">{note.content}</p>
                  <p className="note-timestamp">Uploaded: {formatTimeAgo(note.uploadDate)}</p>
                  <CommentTableNote note={note} noteId={note.noteId}></CommentTableNote>
                </div>
                <div className="card-footer bg-light">
                  <div className="note-actions">
                    <Button onClick={() => navigate(`/edit/${note.noteId}`)} className="btn btn-sm btn-warning">
                      Edit
                    </Button>
                    <Button onClick={() => navigate(`/NotesDetails/${note.noteId}`)} variant="danger">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesPage;
