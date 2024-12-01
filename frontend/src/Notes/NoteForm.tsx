import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Note } from '../types/Note';

interface NoteFormProps {
  onNoteChanged: (newNote: Note) => void;
  noteId?: number;
  isUpdate?: boolean;
  initialData?: Note;
}

const NoteForm: React.FC<NoteFormProps> = ({ onNoteChanged, noteId, isUpdate = false, initialData }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [uploadDate] = useState<Date>(new Date()); 
  const [error] = useState<string | null>(null);

  
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content); //sets the data as what the initial data is
    }
  }, [initialData]); 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const note: Note = { noteId, title, content, uploadDate }; //After submit, the attribute changes
    onNoteChanged(note); 
  };

  const onCancel = () => {
    window.history.back(); //Goes back to previous page
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formNoteTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          pattern="[0-9a-zA-ZæøåÆØÅ. \-?!]{2,20}" //Regular expression pattern
          title="The Name must be numbers or letters and between 2 to 20 characters."
        />
      </Form.Group>

      <Form.Group controlId="formNoteContent">
        <Form.Label>Content</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </Form.Group>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Button variant="primary" type="submit">Save changes</Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
    </Form>
  );
};

export default NoteForm;
