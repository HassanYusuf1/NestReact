import React, { useEffect, useState } from 'react';
import {
  fetchCommentsNote,
  createCommentNote,
  editCommentForNote,
  deleteCommentForNote,
} from './CommentServiceNote';
import { Comment } from '../types/Comment';
import { Note } from '../types/Note';
import { formatTimeAgo } from "../utils/dateUtils";


interface CommentTableProps {
  note: Note;
  noteId: number;
}

const CommentTable: React.FC<CommentTableProps> = ({ note, noteId }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

  const loadComments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCommentsNote(noteId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a valid comment.');
      return;
    }

    try {
      const createdComment = await createCommentNote({
        noteId: note.noteId,
        commentDescription: newComment,
        userName: 'currentUserName', // Replace with actual username
      });

      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editingCommentText.trim()) {
      alert('Please enter a valid comment.');
      return;
    }

    try {
      await editCommentForNote(commentId, { commentDescription: editingCommentText });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? { ...comment, commentDescription: editingCommentText }
            : comment
        )
      );
      setEditingCommentId(null);
      setEditingCommentText('');
    } catch (error) {
      console.error(`Error editing comment with id ${commentId}:`, error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentForNote(commentId);
      setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      if (error.message.includes('Comment not found')) {
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } else {
        console.error(`Error deleting comment with id ${commentId}:`, error);
      }
    }
  };

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, noteId]);

  const toggleCommentsVisibility = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="comments-container">
      {/* Toggle Comments Visibility */}
      <a
        onClick={toggleCommentsVisibility}
        className="view-comments-link"
        aria-label={showComments ? 'Hide Comments' : 'Show Comments'}
      >
        {showComments ? 'Hide Comments' : 'Show Comments'}
      </a>
  
      {/* Add Comment Section */}
      <div className="add-comment-section p-3">
        <textarea
          id="newComment"
          name="newComment"
          className="form-control mb-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={1}
        />
        <button className="btn btn-secondary" onClick={handleCreateComment}>
          Add Comment
        </button>
      </div>
  
      {showComments && (
        <div className="comments-section">
          {isLoading && <p>Loading comments...</p>}
  
          {error && <p className="error-message">{error}</p>}
  
          {!isLoading && !error && comments.length > 0 && (
            <div className="comments-grid">
              {comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="comment-card mb-2 p-2 bg-light shadow-sm rounded"
                >
                  {editingCommentId === comment.commentId ? (
                    <div>
                      <textarea
                        className="form-control mb-2"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleEditComment(comment.commentId)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingCommentText('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-1 fs-6 text-dark">{comment.commentDescription}</p>
                      <div className="text-muted small d-flex justify-content-between align-items-center">
                        <small>{formatTimeAgo(comment.uploadDate)}</small>
                        {comment.userName === 'currentUserName' && (
                          <span className="comment-actions">
                            <button
                              className="btn btn-link text-primary me-2 p-0 fw-bold"
                              onClick={() => {
                                setEditingCommentId(comment.commentId);
                                setEditingCommentText(comment.commentDescription);
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-link text-danger p-0 fw-bold"
                              onClick={() => handleDeleteComment(comment.commentId)}
                            >
                              🗑️ Delete
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
  
  
};

export default CommentTable;
