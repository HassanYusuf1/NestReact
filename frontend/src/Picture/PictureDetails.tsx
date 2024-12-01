import React, { useEffect, useState } from 'react';
import { useParams,  useNavigate } from 'react-router-dom';
import { fetchPictureById } from './PictureService';
import { Picture } from '../types/picture';

const PictureDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [picture, setPicture] = useState<Picture | null>(null);

  
  

  useEffect(() => {
    const loadPicture = async () => {
      try {
        if (id) {
          const data = await fetchPictureById(Number(id)); //Uses a method from the service
          setPicture(data);
        }
      } catch (error) {
        console.error(`Error fetching picture with id ${id}:`, error); //error handling
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

      {/* Image */}
      <img
        src={picture.pictureUrl}
        alt={picture.title || 'Picture'}
        className="picture-feed-card-img"
      />

      {/* Body Section for a picture card */}
      <div className="picture-feed-card-body p-3">
        <p>{picture.description}</p>
        <p>
          <strong>Uploaded on:</strong> {new Date(picture.uploadDate).toLocaleDateString()}
        </p>
      </div>

      

      <div className="p-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)} 

        >
          Return
        </button>
      </div>
    </div>
  );
};

export default PictureDetails;
