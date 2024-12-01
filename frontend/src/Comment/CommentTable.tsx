import React, { useEffect, useState, useCallback } from "react";
import {
  fetchComments,
  createComment,
  editComment,
  deleteComment,
} from "./CommentService";
import { Comment } from "../types/Comment";
import { formatTimeAgo } from "../utils/dateUtils";

interface CommentTableProps {
  pictureId: number; // Identifier for the specific picture
}

const CommentTable: React.FC<CommentTableProps> = ({ pictureId }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>("");

  // Memoize loadComments using useCallback
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchComments(pictureId);

      // Endre her for å bruke commentTime i stedet for uploadDate
      const commentsWithValidDates = data.map((comment) => {
        const commentTime = new Date(comment.commentTime); // Bruk commentTime fra serveren
        return {
          ...comment,
          commentTime: isNaN(commentTime.getTime()) ? null : commentTime, // Bruk commentTime i stedet for uploadDate
        };
      });

      setComments(commentsWithValidDates);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [pictureId]);

  // Load comments on component mount or when the pictureId changes
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a valid comment.");
      return;
    }

    try {
      const createdComment = await createComment({
        pictureId: pictureId,
        commentDescription: newComment,
        userName: "Harry", // For simplicity, you can hardcode userName or get it from the context
      });

      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editingCommentText.trim()) {
      alert("Please enter a valid comment.");
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
      setEditingCommentText("");
    } catch (error) {
      console.error(`Error editing comment with id ${commentId}:`, error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (error) {
      if (error.message.includes("Comment not found")) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.commentId !== commentId)
        );
      } else {
        console.error(`Error deleting comment with id ${commentId}:`, error);
      }
    }
  };

  const toggleCommentsVisibility = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="picture-card-footer p-3">
      {/* Toggle Comments Visibility */}
      {comments.length > 0 && (
        <p className="text-muted">
          <button
            onClick={toggleCommentsVisibility}
            className="view-comments-link btn btn-link p-0"
            style={{ textDecoration: 'none' }}
          >
            View all {comments.length} comments
          </button>
        </p>
      )}

      {/* Hidden Comments Section */}
      {showComments && (
        <div
          id="all-comments"
          style={{ display: showComments ? "block" : "none" }}
        >
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
                  className="comment d-flex justify-content-between align-items-center mb-2"
                >
                  <div>
                    <strong>{comment.userName.split("@")[0]}:</strong>{" "}
                    {comment.commentDescription}
                    <p className="timestamp relative-time text-muted">
                      {formatTimeAgo(comment.commentTime)}{" "}
                      {/* Use commentTime here */}
                    </p>
                  </div>

                  <div className="comment-actions">
                    <button
                      className="btn btn-link text-primary me-2 p-0 fw-bold"
                      onClick={() => {
                        setEditingCommentId(comment.commentId);
                        setEditingCommentText(comment.commentDescription);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-link text-danger p-0 fw-bold"
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
    </div>
  );
};

export default CommentTable;
