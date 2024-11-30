import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { fetchPictureById } from './PictureService';
import { Picture } from '../types/picture';


const PictureDetailsPage: React.FC = () => {
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
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          {picture.pictureUrl && (
            <img src={picture.pictureUrl} alt={picture.title || 'Picture'} className="img-fluid" />
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <h1>{picture.title}</h1>
          <p>{picture.description}</p>
          <p><strong>Uploaded on:</strong> {new Date(picture.uploadDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <button
            className="btn btn-warning me-3"
            onClick={() => navigate(`/pictures/${picture.pictureId}/edit?source=${source}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger me-3"
            onClick={() => navigate(`/pictures/${picture.pictureId}/delete?source=${source}`)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-12">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(source)}
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default PictureDetailsPage;
