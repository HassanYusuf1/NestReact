import React, { useEffect, useState } from 'react';
import { fetchComments } from './CommentService';
import { Comment } from '../types/Comment';

interface CommentTableProps {
  pictureId: number; // Identifier for the specific picture
}

const CommentTable: React.FC<CommentTableProps> = ({ pictureId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(pictureId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    loadComments();
  }, [pictureId]); // Re-run effect if pictureId changes

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