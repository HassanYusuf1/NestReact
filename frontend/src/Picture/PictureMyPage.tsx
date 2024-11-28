
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyPictures } from './PictureService';
import { Picture } from '../types/picture';
import PictureCard from '../shared/PictureCard';

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
              <PictureCard picture={picture} returnUrl="/picture/mypage" />
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
