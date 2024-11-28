import React, { useEffect, useState } from 'react';
import { fetchComments } from './CommentService';
import { Comment } from '../types/Comment';

const CommentTable: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]); // Bruker typen Comment[]

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    loadComments();
  }, []);

  return (
    <div className="comments-grid">
      <h2>Comments</h2>
      <div className="grid">
        {comments.map((comment) => (
          <div key={comment.commentId} className="comment-card">
            <p>{comment.Content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentTable;