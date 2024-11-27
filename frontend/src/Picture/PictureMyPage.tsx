import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyPictures } from './PictureService';

type Picture = {
  pictureId: number;
  title: string;
  description: string;
  pictureUrl: string;
  uploadDate: string;
};

const PictureMyPage: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

      <div className="row mt-5">
        {pictures.length === 0 ? (
          <p>Ingen bilder funnet.</p>
        ) : (
          pictures.map((picture) => (
            <div key={picture.pictureId} className="col-12 col-md-4 col-lg-4 mb-4">
              <div className="picture-card">
                <img
                  src={picture.pictureUrl}
                  alt={picture.title}
                  className="img-fluid picture-image"
                />
                <div className="picture-info">
                  <h3>{picture.title}</h3>
                  <p>{picture.description}</p>
                  <p>Opplastet: {new Date(picture.uploadDate).toLocaleDateString()}</p>
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
