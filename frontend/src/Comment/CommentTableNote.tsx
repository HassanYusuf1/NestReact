import React, { useEffect, useState } from 'react';
import { fetchComments } from './CommentService';
import { Comment } from '../types/Comment';
import { Button } from 'react-bootstrap';

interface CommentTableProps {
  noteId: number; // Identifier for the specific note
}

const CommentTable: React.FC<CommentTableProps> = ({ noteId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false); // State to toggle comments visibility

  useEffect(() => {
    if (showComments) {
      const loadComments = async () => {
        try {
          const data = await fetchComments(noteId);
          setComments(data);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

      loadComments();
    }
  }, [noteId, showComments]); // Re-run effect if noteId or showComments changes

  return (
    <div className="comments-container">
      <a
        onClick={() => setShowComments(!showComments)} 
        className="view-comments-link"
      >
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </a>

      {showComments && (
        <div className="comments-grid">
          <h2>Comments</h2>
          <div className="grid">
            {comments.map((comment) => (
              <div key={comment.commentId} className="comment-card">
                <p>{comment.commentDescription}</p>
                <input type="text" placeholder="Comment something" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentTable;
