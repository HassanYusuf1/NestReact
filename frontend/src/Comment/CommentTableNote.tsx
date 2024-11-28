import React, { useEffect, useState } from 'react';
import { fetchComments } from './CommentService';
import { Comment } from '../types/Comment';

interface CommentTableProps {
  noteId: number; // Identifier for the specific note
}

const CommentTable: React.FC<CommentTableProps> = ({ noteId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(noteId);
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    loadComments();
  }, [noteId]); // Re-run effect if noteId changes

  return (
    <div className="comments-grid">
      <h2>Comments</h2>
      <div className="grid">
        {comments.map((comment) => (
          <div key={comment.commentId} className="comment-card">
            <p>{comment.commentDescription}</p>
            <input type='text'>Comment something</input>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentTable;