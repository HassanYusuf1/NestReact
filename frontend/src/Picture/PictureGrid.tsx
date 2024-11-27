import React, { useEffect, useState } from 'react';
import { fetchPictures } from './PictureService';

const PicturesGridPage: React.FC = () => {
  const [pictures, setPictures] = useState<any[]>([]);

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
      <div className="grid">
        {pictures.map((picture) => (
          <div key={picture.pictureId} className="picture-card">
            <img src={picture.pictureUrl} alt={picture.title} />
            <h3>{picture.title}</h3>
            <p>{picture.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PicturesGridPage;
