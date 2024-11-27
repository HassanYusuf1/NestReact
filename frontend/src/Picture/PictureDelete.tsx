import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePicture } from './PictureService';

const DeletePicturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this picture?')) {
      return;
    }

    try {
      await deletePicture(Number(id));
      navigate('/pictures'); // Naviger tilbake til listen etter sletting
    } catch (error) {
      console.error(`Error deleting picture with id ${id}:`, error);
    }
  };

  return (
    <div>
      <h2>Delete Picture</h2>
      <p>Are you sure you want to delete this picture?</p>
      <button onClick={handleDelete}>Yes, delete it</button>
      <button onClick={() => navigate('/pictures')}>Cancel</button>
    </div>
  );
};

export default DeletePicturePage;
