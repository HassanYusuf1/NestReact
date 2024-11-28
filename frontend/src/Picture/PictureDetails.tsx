import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPictureById } from './PictureService';
import { Picture } from '../types/picture';  

const PictureDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [picture, setPicture] = useState<Picture | null>(null);

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
    <div>
      <h2>Picture Details</h2>
      {picture.pictureUrl && (
        <img src={picture.pictureUrl} alt={picture.title || 'Picture'} />
      )}
      <h3>{picture.title}</h3>
      <p>{picture.description}</p>
      <p>Uploaded by: {picture.userName}</p>
      <p>Upload Date: {new Date(picture.uploadDate).toLocaleDateString()}</p>
    </div>
  );
};

export default PictureDetailsPage;
