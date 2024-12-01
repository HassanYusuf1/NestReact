import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Comment } from '../types/Comment'; 
import { fetchCommentById, deleteComment } from './CommentService'; //Imports methods from the service

const CommentDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>(); //Gets the id to the comment the user want to delete
  const navigate = useNavigate();
  const [comment, setComment] = useState<Comment | null>(null);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const fetchedComment = await fetchCommentById(Number(id)); // fetches the comment id with method from service
          setComment(fetchedComment);
        } catch (err) {
          console.error(`Error fetching comment with id ${id}:`, err);
          setError('Cannot get the comment. Please try again.');
        }
      };
      fetchData();
    }
  }, [id]);

  //Function for handling deleted data
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment for the picture?')) {
      return;
    }

    try {
      await deleteComment(Number(id)); //Deleting the comment with method from service
      navigate('/pictures'); //Navigates back
    } catch (error) {
      console.error(`Error by deleting picture with id: ${id}:`, error);
      setError('Could not delete picture, please try again.');
    }
  };

  if (error) {
    return <p>{error}</p>; //Display error
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

export default CommentDelete;
