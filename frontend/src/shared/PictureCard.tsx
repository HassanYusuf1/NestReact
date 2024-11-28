import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Picture } from '../types/picture';
import { createComment } from '../Comment/CommentService';
import CommentTable from '../Comment/CommentTable';

type PictureCardProps = {
  picture: Picture;
  returnUrl: string; 
};

const PictureCard: React.FC<PictureCardProps> = ({ picture, returnUrl }) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<string>("");
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a valid comment.");
      return;
    }
    
    try {
      await createComment({
        pictureId: picture.pictureId,
        commentDescription: newComment,
        userName: "currentUserName" // Du kan erstatte dette med faktisk brukernavn for innlogget bruker
      });
      setNewComment(""); 
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div className="picture-feed-card mb-4">
      {/* Header with Username and Timestamp aligned left */}
      <div className="picture-feed-card-header d-flex align-items-center p-2">
        <span className="username">{"userNameBeforeAt"}</span>
        <span className="text-muted ms-2">• Uploaded on {new Date(picture.uploadDate).toLocaleDateString()}</span>
      </div>

      {/* Image Section */}
      <Link to={`/pictures/${picture.pictureId}?source=${returnUrl}`} className="text-decoration-none">
        <img
          src={picture.pictureUrl}
          alt={picture.title || 'Picture'}
          className="picture-feed-card-img img-fluid"
        />
      </Link>

      {/* Description Styled Like Instagram */}
      <div className="picture-feed-card-body p-3">
        <p className="card-text">
          <span className="username-in-description">{"userNameBeforeAt"} </span>
          {picture.description}
        </p>
      </div>

      {/* Edit, Delete, and Download buttons */}
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

      {/* Footer with Comments and Add Comment Section */}
      <div className="picture-card-footer p-3">
        {/* "View All Comments" link */}
        <p className="text-muted">
          <a
            href="javascript:void(0);"
            onClick={() => setCommentsVisible(!commentsVisible)}
            className="view-comments-link"
          >
            {commentsVisible ? "Hide comments" : `View all comments`}
          </a>
        </p>

        {/* Comments Section - Toggle Visibility */}
        {commentsVisible && (
          <div id={`all-comments-${picture.pictureId}`} className="comments-section">
            <CommentTable pictureId={picture.pictureId} />
          </div>
        )}

        {/* Add Comment Section */}
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
