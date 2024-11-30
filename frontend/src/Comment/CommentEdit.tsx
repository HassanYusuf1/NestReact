import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommentForm from './CommentForm';
import { Comment } from '../types/Comment';
import API_URL from '../apiConfig';


const CommentUpdatePage: React.FC = () => {
  const { commentId } = useParams<{ commentId: string }>(); 
  const navigate = useNavigate(); 
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(`${API_URL}/api/commentapi/${commentId}`); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setComment(data);
      } catch (error) {
        setError('Failed to fetch comment');
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [commentId]);

  const handleCommentUpdated = async (comment: Comment) => {

    try {
      const response = await fetch(`${API_URL}/api/CommentAPI/edit/${comment.commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Comment updated successfully:', data);
      navigate('/pictures'); // Navigate back after successful creation
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!comment) return <p>No comment found</p>;
  
  return (
    <div>
      <h2>Update Comment</h2>
      <CommentForm onCommentChanged={handleCommentUpdated} commentId={comment.commentId} isUpdate={true} initialData={comment} />
    </div>
  );
};

export default CommentUpdatePage;