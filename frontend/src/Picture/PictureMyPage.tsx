import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchMyPictures } from './PictureService';
import { Picture } from '../types/picture';

const PictureMyPage: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchMyPictures();
        setPictures(data);
      } catch (err) {
        setError('Kunne ikke laste bilder. Vennligst prøv igjen senere.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Laster bilder...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container-page">
      <h1>Mine Bilder</h1>

      {/* Render a grid of pictures */}
      <div className="row mt-5">
        {pictures.length === 0 ? (
          <p>Ingen bilder funnet.</p>
        ) : (
          pictures.map((picture) => (
            <div key={picture.pictureId} className="col-12 col-md-4 col-lg-4 mb-4">
              <div className="picture-card">
                <Link to={`/pictures/${picture.pictureId}`}>
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
                    onClick={() => navigate(`/pictures/${picture.pictureId}/edit`)}
                  >
                    Rediger
                  </button>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => navigate(`/pictures/${picture.pictureId}/delete`)}
                  >
                    Slett
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.href = picture.pictureUrl}
                  >
                    Last ned
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-center">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/pictures/create')}
        >
          Last opp nytt bilde
        </button>
      </div>
    </div>
  );
};

export default PictureMyPage;
