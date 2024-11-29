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
        setError('Could not load pictures. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading pictures...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container-page">
      <h1 className="text-center mb-4">My Pictures</h1>
      <div className="row mt-5">
        {pictures.length === 0 ? (
          <p className="text-center">No pictures found.</p>
        ) : (
          pictures.map((picture) => (
            <div key={picture.pictureId} className="col-md-6 col-lg-4 mb-4">
              <PictureCard picture={picture} returnUrl="/picture/mypage" />
            </div>
          ))
        )}
      </div>
      <div className="mt-5 text-center">
        <button
          className="btn btn-primary btn-lg rounded-pill shadow-sm"
          onClick={() => navigate('/pictures/create')}
        >
          📤 Upload New Picture
        </button>
      </div>
    </div>
  );
};

export default PictureMyPage;
