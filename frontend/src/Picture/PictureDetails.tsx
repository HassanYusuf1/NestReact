import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchPictureById } from './PictureService';
import { Picture } from '../types/picture';

const PictureDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [picture, setPicture] = useState<Picture | null>(null);

  // Hent "source" parameter fra URL-en for å kunne navigere tilbake
  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get('source') || '/picture/grid';

  useEffect(() => {
    const loadPicture = async () => {
      try {
        if (id) {
          const data = await fetchPictureById(Number(id));
          setPicture(data);
        }
      } catch (error) {
        console.error(`Error fetching picture with id ${id}:`, error);
      }
    };
    loadPicture();
  }, [id]);

  if (!picture) {
    return <div>Loading...</div>;
  }

  return (
    <div className="picture-feed-card container mt-4">
      {/* Header with Title */}
      <h1 className="username-in-description">{picture.title}</h1>

      {/* Image Section */}
      <img
        src={picture.pictureUrl}
        alt={picture.title || 'Picture'}
        className="picture-feed-card-img"
      />

      {/* Body Section */}
      <div className="picture-feed-card-body p-3">
        <p>{picture.description}</p>
        <p>
          <strong>Uploaded on:</strong> {new Date(picture.uploadDate).toLocaleDateString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="picture-feed-card-actions p-3 d-flex gap-2">
        <button
          className="btn btn-warning btn-sm"
          onClick={() => navigate(`/pictures/${picture.pictureId}/edit?source=${location.pathname}`)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => navigate(`/pictures/${picture.pictureId}/delete?source=${location.pathname}`)}
        >
          Delete
        </button>
      </div>

      <div className="p-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(source)} 

        >
          Return
        </button>
      </div>
    </div>
  );
};

export default PictureDetails;
