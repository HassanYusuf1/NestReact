import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPictureById } from './PictureService';

const PictureDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [picture, setPicture] = useState<any>(null);

  useEffect(() => {
    const loadPicture = async () => {
      try {
        const data = await fetchPictureById(Number(id));
        setPicture(data);
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
      <img src={picture.pictureUrl} alt={picture.title} />
      <h3>{picture.title}</h3>
      <p>{picture.description}</p>
      <p>Uploaded by: {picture.userName}</p>
      <p>Upload Date: {new Date(picture.uploadDate).toLocaleDateString()}</p>
    </div>
  );
};

export default PictureDetailsPage;
