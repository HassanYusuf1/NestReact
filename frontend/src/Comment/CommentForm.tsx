import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Comment } from '../types/Comment';

interface CommentFormProps {
  onCommentChanged: (newComment: Comment) => void;
  commentId?: number;
  isUpdate?: boolean;
  initialData?: Comment;
}

const CommentForm: React.FC<CommentFormProps> = ({ onCommentChanged, commentId, isUpdate = false, initialData }) => {
  const [commentDescription, setCommentDescription] = useState<string>(''); // Endret fra 'Content' til 'commentDescription'
  const [userName, setUserName] = useState<string>('');
  const [uploadDate, setUploadDate] = useState<Date>(new Date()); // Default to the current date
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1); // This will navigate back one step in the history
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const comment: Comment = { commentId, commentDescription, uploadDate, userName }; // Bruker 'commentDescription'
    onCommentChanged(comment); // Call the passed function with the comment data
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formCommentContent">
        <Form.Label>Content</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter comment content"
          value={commentDescription} // Bruker 'commentDescription'
          onChange={(e) => setCommentDescription(e.target.value)} // Oppdaterer 'commentDescription'
          required
        />
      </Form.Group>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Button variant="primary" type="submit">Create comment</Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2">Cancel</Button>
    </Form>
  );
};

export default CommentForm;
