import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Picture } from "../types/picture";
import { Comment } from "../types/Comment";
import {
  createComment,
  fetchComments,
  deleteComment,
} from "../Comment/CommentService";
import "../../src/layout.css";
import { formatTimeAgo } from "../utils/dateUtils"; // Juster stien basert på prosjektstrukturen

type PictureCardProps = {
  picture: Picture;
  returnUrl: string;
};

const PictureCard: React.FC<PictureCardProps> = ({ picture, returnUrl }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<string>("");
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(picture.pictureId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    loadComments();
  }, [picture.pictureId]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a valid comment.");
      return;
    }

    try {
      const createdComment = await createComment({
        pictureId: picture.pictureId,
        commentDescription: newComment,
        userName: "currentUserName",
      });

      setComments((prevComments) => [...prevComments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (error) {
      console.error(`Error deleting comment with id ${commentId}:`, error);
    }
  };

  const userName = picture.userName ? picture.userName.split("@")[0] : "Harry";

  return (
    <div className="picture-feed-card mb-4">
      {/* Header */}
      <div className="picture-feed-card-header d-flex align-items-center justify-content-between p-2">
        <h5 className="username">{userName}</h5>
        <small className="relative-time text-muted">
          {formatTimeAgo(picture.uploadDate)}
        </small>
      </div>

      {/* Image Section */}
      <img
        src={picture.pictureUrl}
        alt={picture.title || "Picture"}
        className="picture-feed-card-img"
        onClick={() => navigate(`/pictures/${picture.pictureId}`)}
        style={{ cursor: "pointer" }}
      />

      {/* Body Section */}
      <div className="picture-feed-card-body p-3">
        <p className="card-text">
          <span className="username-in-description">{userName}:</span>{" "}
          {picture.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="picture-feed-card-actions p-3 d-flex gap-2">
        <button
          className="btn btn-warning btn-sm"
          onClick={() =>
            navigate(`/pictures/${picture.pictureId}/edit?source=${returnUrl}`)
          }
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() =>
            navigate(
              `/pictures/${picture.pictureId}/delete?source=${returnUrl}`
            )
          }
        >
          Delete
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => (window.location.href = picture.pictureUrl)}
        >
          Download Image
        </button>
      </div>

      {/* Footer with Comments */}
      <div className="picture-feed-card-footer p-3">
        {comments.length > 0 && (
          <button
            type="button"
            onClick={() => setCommentsVisible(!commentsVisible)}
            className="btn btn-link p-0 text-muted view-comments-link"
          >
            {commentsVisible
              ? "Hide comments"
              : `View all ${comments.length} comments`}
          </button>
        )}

        {commentsVisible && (
          <div className="comments-section">
            {comments.map((comment) => (
              <div
                key={comment.commentId}
                className="d-flex justify-content-between mb-2"
              >
                <div>
                  <strong>{comment.userName}</strong>:{" "}
                  {comment.commentDescription}
                  <p className="relative-time text-muted">
                    {formatTimeAgo(comment.uploadDate)}
                  </p>
                </div>
                {comment.userName === "currentUserName" && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteComment(comment.commentId)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <form
          className="comment-form mt-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateComment();
          }}
        >
          <textarea
            className="comment-textarea"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit" className="btn btn-primary mt-2">
            Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PictureCard;
