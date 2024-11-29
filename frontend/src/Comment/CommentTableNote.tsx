import React, { useEffect, useState } from 'react';
import { fetchCommentsNote } from './CommentServiceNote'; // Service to fetch comments
import { Comment } from '../types/Comment';

interface CommentTableProps {
  noteId: number; // Identifier for the specific note
}

const CommentTable: React.FC<CommentTableProps> = ({ noteId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    setIsLoading(true); // Start loading
    setError(null); // Reset error
  
    try {
      const data = await fetchCommentsNote(noteId) // Fetch data
      setComments(data); // Update state with the fetched comments
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, noteId]); // Re-run effect when showComments or noteId changes

  const toggleCommentsVisibility = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="comments-container">
      {/* Toggle visibility button */}
      <a
        onClick={toggleCommentsVisibility}
        className="view-comments-link"
        aria-label={showComments ? 'Hide Comments' : 'Show Comments'}
      >
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </a>

      {/* Conditional rendering of comments */}
      {showComments && (
        <div className="comments-section">
          <h2>Comments</h2>

          {/* Display loading state */}
          {isLoading && <p>Loading comments...</p>}

          {/* Display error state */}
          {error && <p className="error-message">{error}</p>}

          {/* Display comments */}
          {!isLoading && !error && comments.length > 0 && (
            <div className="comments-grid">
              {comments.map((comment) => (
                <div key={comment.commentId} className="comment-card">
                  <p>{comment.commentDescription}</p>
                  <input
                    type="text"
                    placeholder="Add a reply..."
                    className="reply-input"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Fallback for no comments */}
          {!isLoading && !error && comments.length === 0 && (
            <p>No comments available for this note.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentTable;