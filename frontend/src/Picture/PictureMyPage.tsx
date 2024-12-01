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
        const data = await fetchMyPictures(); //uses method from service
        setPictures(data);
      } catch (err) {
        setError('Could not load pictures. Please try again later.'); //error handling
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
    return <p>{error}</p>; //Displays error if error
  }

  return (
    <div className="container-page">
      <h2 className="spaced-heading">My Pictures</h2>
      <div className="row mt-5">
        {pictures.length === 0 ? (
          <p className="text-center">No pictures found.</p>
        ) : (
          /* uses picture as argument in .map() to retrieve pictures*/
          pictures.map((picture) => (
            <div key={picture.pictureId} className="col-12 col-md-6 col-lg-6 mb-4">
              <PictureCard picture={picture} returnUrl="/picture/mypage" />
            </div>
          ))
        )}
      </div>
      <div className="mt-5 text-center">
        <button /* Action Buttons */
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
