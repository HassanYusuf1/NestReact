import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { Comment } from "../types/Comment";

interface CommentFormProps {
  onCommentChanged: (newComment: Comment) => void;
  commentId?: number;
  isUpdate?: boolean;
  initialData?: Comment;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onCommentChanged,
  commentId,
  isUpdate = false,
  initialData,
}) => {
  const [commentDescription, setCommentDescription] = useState<string>(""); // Endret fra 'Content' til 'commentDescription'
  const [userName] = useState<string>("");
  const [uploadDate] = useState<Date>(new Date()); // Default to the current date
  const [error] = useState<string | null>(null);
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1); // This will navigate back one step in the history
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const comment: Comment = { commentId, commentDescription, userName };
    onCommentChanged(comment);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formCommentContent">
        <Form.Label>Content</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter comment content"
          value={commentDescription}
          onChange={(e) => setCommentDescription(e.target.value)} 
          required
        />
      </Form.Group>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Button variant="primary" type="submit">
        Save
      </Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2">
        Cancel
      </Button>
    </Form>
  );
};

export default CommentForm;
