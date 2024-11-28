import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Picture } from '../types/picture';

type PictureCardProps = {
  picture: Picture;
  returnUrl: string; 
};

const PictureCard: React.FC<PictureCardProps> = ({ picture, returnUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="picture-card">
      {/* Send med "source" parameteren i lenken til detaljer */}
      <Link to={`/pictures/${picture.pictureId}?source=${returnUrl}`}>
        <img
          src={picture.pictureUrl}
          alt={picture.title || 'Picture'}
          className="img-fluid picture-image"
        />
      </Link>
      <div className="picture-info">
        <h3>{picture.title}</h3>
        <p>{picture.description}</p>
        <p>Opplastet: {new Date(picture.uploadDate).toLocaleDateString()}</p>
      </div>
      <div className="picture-actions mt-3 d-flex justify-content-center">
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
          Download
        </button>
      </div>
    </div>
  );
};

export default PictureCard;
