import {  useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Note } from '../types/Note';
import NotesDetails from './NotesDetails';
import { fetchNoteByIdForDisplay } from './NoteService'; //imports service method

const NotesCreate: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>(); //gets the note id from url
  const [, setNote] = useState<Note | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) {
        setError('No note ID provided.'); //error handling if not found
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNoteByIdForDisplay(noteId);
        setNote(data); //Update state with fetched note
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch note.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  return (
    <div>
      <h2>Are you sure you want to delete this note?</h2>
      <NotesDetails />
    </div>
  );
};

export default NotesCreate;
