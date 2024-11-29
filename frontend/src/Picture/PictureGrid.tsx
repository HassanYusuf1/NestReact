import React, { useEffect, useState } from 'react';
import { fetchPictures } from './PictureService';
import { Picture } from '../types/picture';
import PictureCard from '../shared/PictureCard';

const PicturesGridPage: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);

  useEffect(() => {
    const loadPictures = async () => {
      try {
        const data = await fetchPictures();
        setPictures(data);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    };

    loadPictures();
  }, []);

  return (
    <div className="pictures-grid">
      <h2>All Pictures</h2>
      <div className="row">
        {pictures.map((picture) => (
          <div key={picture.pictureId} className="col-12 mb-4">
            <PictureCard picture={picture} returnUrl="/pictures" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PicturesGridPage;
