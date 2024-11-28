import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Comment } from '../types/Comment'; // Sørg for at du har riktig Comment-type
import { fetchCommentById, deleteComment } from './CommentService';

const DeleteCommentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState<Comment | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Henter kommentar med gitt ID når komponenten lastes inn
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const fetchedComment = await fetchCommentById(Number(id));
          setComment(fetchedComment);
        } catch (err) {
          console.error(`Error fetching comment with id ${id}:`, err);
          setError('Cannot get the comment. Please try again.');
        }
      };
      fetchData();
    }
  }, [id]);

  // Funksjon for å håndtere sletting av kommentar
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment for the picture?')) {
      return;
    }

    try {
      await deleteComment(Number(id));
      navigate('/pictures'); // Navigerer tilbake til oversikten etter sletting
    } catch (error) {
      console.error(`Feil ved sletting av bildet med id ${id}:`, error);
      setError('Kunne ikke slette bildet. Vennligst prøv igjen senere.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!comment) {
    return <p>Laster kommentar...</p>;
  }

  return (
    <div className="container">
      <h2>Delete Comment</h2>
      <p>Are you sure you want to delete this comment?</p>
      <div className="mt-3">
        <button onClick={handleDelete} className="btn btn-danger me-3">Delete</button>
        <button
          onClick={() => navigate('/pictures')}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteCommentPage;
