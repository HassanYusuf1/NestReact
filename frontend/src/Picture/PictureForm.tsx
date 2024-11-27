import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Picture } from '../types/picture';

interface PictureFormProps {
  picture: Picture;
  isMyPage: boolean;
}

const PictureForm: React.FC<PictureFormProps> = ({ picture, isMyPage }) => {
  const navigate = useNavigate();
  const userNameBeforeAt = picture.userName?.split('@')[0] || 'Unknown';

  const handleEdit = () => {
    navigate(`/pictures/${picture.pictureId}/edit`, { state: { source: isMyPage ? 'MyPage' : 'Grid' } });
  };

  const handleDelete = () => {
    navigate(`/pictures/${picture.pictureId}/delete`, { state: { source: isMyPage ? 'MyPage' : 'Grid' } });
  };

  const handleDownload = () => {
    window.location.href = picture.pictureUrl;
  };

  return (
    <div className="picture-feed-card mb-4">
      <div className="picture-feed-card-header d-flex align-items-center p-2">
        <span className="username">@{userNameBeforeAt}</span>
        <span className="text-muted ms-2">
          • {new Date(picture.uploadDate).toLocaleString()}
        </span>
      </div>

      <a href={`/pictures/${picture.pictureId}`} className="text-decoration-none">
        <img className="picture-feed-card-img" src={picture.pictureUrl} alt={picture.title} />
      </a>

      <div className="picture-feed-card-body p-3">
        <p className="card-text">
          <span className="username-in-description">@{userNameBeforeAt}</span> {picture.description}
        </p>
      </div>

      {isMyPage && (
        <div className="p-3 d-flex justify-content-start">
          <button className="btn btn-warning me-2" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btn-danger me-2" onClick={handleDelete}>
            Delete
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default PictureForm;
