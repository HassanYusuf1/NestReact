import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyNotes } from './NoteService';
import { Note } from '../types/Note';
import { Button } from 'react-bootstrap';

const NotesMyPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchMyNotes();
        setNotes(data);
      } catch (err) {
        setError('Could not load notes. Please try again later.');
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
    return <p>{error}</p>;
  }

  return (
    <div className="container-page">
    <h1 className="text-center mb-4">My Notes</h1>
    <div className="row mt-5">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {notes.map((note) => (
        <div key={note.noteId} className="card mb-4 shadow-sm note-card">
          <div className="card-body">
            <h4 className="note-title">{note.title}</h4>
            <p className="note-content">{note.content}</p>
            <p className="note-timestamp">
              Uploaded: {new Date(note.uploadDate).toLocaleDateString()}
            </p>
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
    <div className="mt-5 text-center">
      <button
        className="btn btn-primary btn-lg rounded-pill shadow-sm"
        onClick={() => navigate('/notescreate')}
      >
        📤 Upload New Note
      </button>
    </div>
  </div>
  );
};
  
export default NotesMyPage;
