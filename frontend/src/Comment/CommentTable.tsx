import React, { useEffect, useState, useCallback } from 'react';
import {
  fetchComments,
  createComment,
  editComment,
  deleteComment,
} from './CommentService';
import { Comment } from '../types/Comment';
import { formatTimeAgo } from "../utils/dateUtils";

interface CommentTableProps {
  pictureId: number; // Identifier for the specific picture
}

const CommentTable: React.FC<CommentTableProps> = ({ pictureId }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

  // Memoize loadComments using useCallback
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchComments(pictureId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [pictureId]);

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments, loadComments]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a valid comment.');
      return;
    }

    try {
      const createdComment = await createComment({
        pictureId: pictureId,
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
      await editComment(commentId, { commentDescription: editingCommentText });
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
      await deleteComment(commentId);
      setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
    } catch (error) {
      if (error.message.includes('Comment not found')) {
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentId));
      } else {
        console.error(`Error deleting comment with id ${commentId}:`, error);
      }
    }
  };

  const toggleCommentsVisibility = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="comments-container">
      {/* Toggle Comments Visibility */}
      <p
        onClick={toggleCommentsVisibility}
        className="view-comments-p"
        aria-label={showComments ? 'Hide Comments' : `Show Comments (${comments.length})`}
      >
        {showComments ? `Hide Comments (${comments.length})` : `Show Comments (${comments.length})`}
      </p>

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

          {!isLoading && !error && comments.length === 0 && (
            <p>No comments found.</p>
          )}

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
