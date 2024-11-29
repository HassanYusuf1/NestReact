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
        userName: "currentUserName" // Husk å erstatte dette med den innloggede brukeren.
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
      setEditingCommentId(null);
      setEditingCommentText("");
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
    <div className="picture-feed-card mb-4">
      <div className="picture-feed-card-header d-flex align-items-center p-2">
        <span className="text-muted ms-2">Uploaded on {new Date(picture.uploadDate).toLocaleDateString()}</span>
      </div>

      <Link to={`/pictures/${picture.pictureId}?source=${returnUrl}`} className="text-decoration-none">
        <img
          src={picture.pictureUrl}
          alt={picture.title || 'Picture'}
          className="picture-feed-card-img img-fluid"
        />
      </Link>

      <div className="picture-feed-card-body p-3">
        <p className="card-text">
          {picture.description}
        </p>
      </div>

      <div className="p-3 d-flex justify-content-start">
        <button
          className="btn btn-warning me-2"
          onClick={() => navigate(`/pictures/${picture.pictureId}/edit?source=${returnUrl}`)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger me-2"
          onClick={() => navigate(`/pictures/${picture.pictureId}/delete?source=${returnUrl}`)}
        >
          Delete
        </button>
        <button
          className="btn btn-primary"
          onClick={() => window.location.href = picture.pictureUrl}
        >
          Download Image
        </button>
      </div>

      <div className="picture-card-footer p-3">
      <p className="text-muted">
  <button
    type="button"
    onClick={() => setCommentsVisible(!commentsVisible)}
    className="view-comments-link btn btn-link p-0"
  >
    {commentsVisible ? "Hide comments" : `View all comments`}
  </button>
</p>


        {commentsVisible && (
          <div id={`all-comments-${picture.pictureId}`} className="comments-section">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.commentId} className="comment-card p-2 mb-2">
                  {editingCommentId === comment.commentId ? (
                    <div>
                      <textarea
                        className="form-control mb-2"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        autoFocus
                      />
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleEditComment(comment.commentId)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
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
                      <p>{comment.commentDescription}</p>
                      <p className="text-muted small">
                        {comment.uploadDate ? new Date(comment.uploadDate).toLocaleString() : "Unknown date"}
                      </p>
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          setEditingCommentId(comment.commentId);
                          setEditingCommentText(comment.commentDescription);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-link text-danger"
                        onClick={() => handleDeleteComment(comment.commentId)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No comments found.</p>
            )}
          </div>
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
    </div>
  );
};

export default PictureCard;
