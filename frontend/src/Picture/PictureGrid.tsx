import React, { useEffect, useState } from 'react';
import { fetchPictures } from './PictureService';
import { Picture } from '../types/picture';
import PictureCard from '../shared/PictureCard'; //uses picturecard from shared

const PictureGrid: React.FC = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);

  useEffect(() => {
    const loadPictures = async () => { //loading pictures using method from service
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
      <h1>Picture Feed</h1>
      <div className="row flex-column align-items-center">
        {pictures.map((picture) => ( /* Uses .map() to retrieve pictures for the shared HTML body  */
          <div key={picture.pictureId} className="col-12 mb-4">
            <PictureCard picture={picture} returnUrl="/pictures" /> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default PictureGrid;
