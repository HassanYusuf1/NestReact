import React, { useEffect, useState } from 'react';
import { fetchCommentsNote, createCommentNote } from './CommentServiceNote'; // Service to fetch comments
import { Comment } from '../types/Comment';
import { Note } from '../types/Note';

interface CommentTableProps {
  note: Note;
  noteId: number; // Identifier for the specific note
}

const CommentTable: React.FC<CommentTableProps> = ({ note, noteId }) => {
  const [newComment, setNewComment] = useState<string>("");
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

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a valid comment.");
      return;
    }

    try {
      const createdComment = await createCommentNote({
        noteId: note.noteId,
        commentDescription: newComment,
        userName: "currentUserName" // Husk å erstatte dette med den innloggede brukeren.
      });

      setComments(prevComments => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
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
                  <p>{new Date(comment.uploadDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}

            {/* Fallback for no comments */}
            {!isLoading && !error && comments.length === 0 && (
              <p>No comments available for this note.</p>
            )}
          
          <div className="add-comment-section p-3">
          <textarea
            id="newComment"
            name="newComment"
            className="form-control mb-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            className="btn btn-secondary"
            onClick={handleCreateComment}
          >
            Add Comment
          </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default CommentTable;