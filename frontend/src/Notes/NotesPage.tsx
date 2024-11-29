import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Note } from '../types/Note';
import { useNavigate } from 'react-router-dom';
import { fetchAllNotes } from './NoteService'
import CommentTableNote from '../Comment/CommentTableNote';

const API_URL = 'http://localhost:5215';


const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]); // State for notes, typed as an array of Note
  const [loading, setLoading] = useState<boolean>(false); // State for loading, typed as boolean
  const [error, setError] = useState<string | null>(null); // State for error, typed as string or null

  useEffect(() => {
    fetchAllNotes();
  }, []);

  return (
    <div>
      <Button onClick={() => navigate(`/notescreate`)} className="btn btn-secondary mt-3">Create Note</Button>
      <h1>Notes</h1>
      <Button onClick={fetchAllNotes} className="btn btn-primary mb-3" disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Items'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {notes.map(note => (
        <div key={note.noteId} className="card mb-4 shadow-sm note-card">
          <div className="card-body">
            <h4 className="note-title">{note.title}</h4>
            <p className="note-content">{note.content}</p>
            <p className="note-timestamp">Uploaded: {new Date(note.uploadDate).toLocaleDateString()}</p>
            <CommentTableNote note={note} noteId={note.noteId}></CommentTableNote>
          </div>
          <div className="card-footer bg-light">
            <div className="note-actions">
              <Button onClick={() => navigate(`/edit/${note.noteId}`)} className="btn btn-sm btn-warning">Edit</Button>
              <Button onClick={() => navigate(`/NotesDetails/${note.noteId}`)} variant="danger">Details</Button> 
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesPage;
