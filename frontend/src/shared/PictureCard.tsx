import React from "react";
import { useNavigate } from "react-router-dom";
import { Picture } from "../types/picture";
import "../css/layout.css";
import { formatTimeAgo } from "../utils/dateUtils"; 
import CommentTable from "../Comment/CommentTable"; //Adjust paths based on project structure

type PictureCardProps = { //Card prop
  picture: Picture;
  returnUrl: string;
};

const PictureCard: React.FC<PictureCardProps> = ({ picture, returnUrl }) => {
  const navigate = useNavigate();
  const userName = picture.userName ? picture.userName.split("@")[0] : "Harry"; //initialize variables

  return (
    <div className="picture-feed-card mb-4">
      {/* Header */}
      <div className="picture-feed-card-header d-flex align-items-center p-2">
        <h5 className="username">{userName}</h5>
        <small className="relative-time text-muted">
          {formatTimeAgo(picture.uploadDate)}
        </small>
      </div>

      {/* Image */}
      <img
        src={picture.pictureUrl}
        alt={picture.title || "Picture"}
        className="picture-feed-card-img"
        onClick={() => navigate(`/pictures/${picture.pictureId}`)}
        style={{ cursor: "pointer" }}
      />

      {/* Body for the image card*/}
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

      {/* Comments Section */}
      <div className="picture-feed-card-footer p-3">
        <CommentTable pictureId={picture.pictureId} />
      </div>
    </div>
  );
};

export default PictureCard;
