import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Picture } from '../types/picture';
import { Comment } from '../types/Comment'; // Import the Comment interface
import { createComment, fetchComments } from '../Comment/CommentService';

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
    if (commentsVisible) {
      fetchComments(picture.pictureId)
        .then(setComments)
        .catch((error) => console.error('Error fetching comments:', error));
    }
  }, [commentsVisible, picture.pictureId]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a valid comment.");
      return;
    }

    try {
      await createComment({
        pictureId: picture.pictureId,
        commentDescription: newComment,
        userName: "currentUserName" // Dette kan fjernes eller endres avhengig av ditt backend-oppsett
      });
      setNewComment("");
      setCommentsVisible(true);
      // Fetch updated comments
      fetchComments(picture.pictureId)
        .then(setComments)
        .catch((error) => console.error('Error fetching comments:', error));
    } catch (error) {
      console.error("Error creating comment:", error);
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
          <a
            href="javascript:void(0);"
            onClick={() => setCommentsVisible(!commentsVisible)}
            className="view-comments-link"
          >
            {commentsVisible ? "Hide comments" : `View all comments`}
          </a>
        </p>

        {commentsVisible && (
          <div id={`all-comments-${picture.pictureId}`} className="comments-section">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.commentId} className="comment-card p-2 mb-2">
                  <p>{comment.commentDescription}</p>
                  <p className="text-muted small">{new Date(comment.uploadDate).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p>No comments found.</p>
            )}
          </div>
        )}

        <div className="add-comment-section p-3">
          <textarea
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
