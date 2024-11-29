import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Picture } from '../types/picture';
import { Comment } from '../types/Comment';
import { createComment, fetchComments, editComment, deleteComment } from '../Comment/CommentService';

type PictureCardProps = {
  picture: Picture;
  returnUrl: string;
};

const PictureCard: React.FC<PictureCardProps> = ({ picture, returnUrl }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<string>("");
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>("");

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(picture.pictureId);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
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
        userName: "currentUserName" // Replace with the logged-in user.
      });

      setComments(prevComments => [...prevComments, createdComment]);
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
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.commentId === commentId ? { ...comment, commentDescription: editingCommentText } : comment
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
      setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      if (error.message.includes("Comment not found")) {
        setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
      } else {
        console.error(`Error deleting comment with id ${commentId}:`, error);
      }
    }
  };

  return (
    <div className="picture-feed-card mb-4 shadow-sm rounded overflow-hidden">
      <div className="picture-feed-card-header d-flex align-items-center p-2 bg-gradient rounded-top" style={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)' }}>
        <span className="text-white fw-bold fs-6">📅 {new Date(picture.uploadDate).toLocaleDateString()}</span>
      </div>

      <Link to={`/pictures/${picture.pictureId}?source=${returnUrl}`} className="text-decoration-none">
        <div className="image-wrapper position-relative">
          <img
            src={picture.pictureUrl}
            alt={picture.title || 'Picture'}
            className="picture-feed-card-img img-fluid rounded"
          />
          <div className="image-overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
            <h5 className="text-white text-center fw-bold" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>Click to View More</h5>
          </div>
        </div>
      </Link>

      <div className="picture-feed-card-body p-3 bg-dark text-light">
        <p className="card-text mb-1 fs-6">
          🖼️ <em>{picture.description}</em>
        </p>
      </div>

      <div className="p-3 d-flex justify-content-between gap-2 bg-dark">
        <button
          className="btn btn-outline-warning btn-sm rounded-pill shadow-sm"
          onClick={() => navigate(`/pictures/${picture.pictureId}/edit?source=${returnUrl}`)}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-outline-danger btn-sm rounded-pill shadow-sm"
          onClick={() => navigate(`/pictures/${picture.pictureId}/delete?source=${returnUrl}`)}
        >
          🗑️ Delete
        </button>
        <button
          className="btn btn-outline-primary btn-sm rounded-pill shadow-sm"
          onClick={() => window.location.href = picture.pictureUrl}
        >
          ⬇️ Download Image
        </button>
      </div>

      <div className="picture-card-footer p-3 bg-light rounded-bottom">
        <p className="text-muted text-center">
          {comments.length > 0 && (
            <button
              type="button"
              onClick={() => setCommentsVisible(!commentsVisible)}
              className="view-comments-link btn btn-link text-decoration-none fs-6 fw-bold"
              style={{ color: '#ff7e5f' }}
            >
              {commentsVisible ? "Hide comments" : `💬 View all ${comments.length} comments`}
            </button>
          )}
        </p>

        {commentsVisible && (
          <div id={`all-comments-${picture.pictureId}`} className="comments-section mt-3 bg-white p-3 rounded shadow-sm">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.commentId} className="comment mb-2 p-2 bg-light shadow-sm rounded">
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
                          setEditingCommentText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-1 fs-6 text-dark">{comment.commentDescription}</p>
                      <div className="text-muted small d-flex justify-content-between align-items-center">
                        <small>{comment.uploadDate ? new Date(comment.uploadDate).toLocaleString() : "Unknown date"}</small>
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
              ))
            ) : (
              <p className="text-center fs-6 text-muted">No comments found.</p>
            )}
          </div>
        )}

        <div className="add-comment-section mt-3">
          <form onSubmit={(e) => { e.preventDefault(); handleCreateComment(); }}>
            <div className="input-group">
              <textarea
                id="newComment"
                name="newComment"
                className="form-control rounded shadow-sm"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={1}
                required
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateComment();
                  }
                }}
              />
              <button className="btn btn-warning btn-sm rounded-pill ms-2 shadow-sm" type="submit">
                🚀 Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PictureCard;