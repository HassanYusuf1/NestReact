import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchPictureById, deletePicture } from './PictureService';
import { Picture } from '../types/picture';

const PictureDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [picture, setPicture] = useState<Picture | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get('source') || '/picture/grid'; 

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const fetchedPicture = await fetchPictureById(Number(id)); //Uses method from service
          setPicture(fetchedPicture);
        } catch (err) {
          console.error(`Error fetching picture with id ${id}:`, err); //error handling
          setError('Could not get picture information.');
        }
      };
      fetchData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this picture?')) { //uses a window for confirmation
      return;
    }

    try {
      await deletePicture(Number(id)); //uses method from service for deletion
      navigate(source);
    } catch (error) {
      console.error(`Failed to delete picture with ID. ${id}:`, error); 
      setError('Could not delete the picture.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!picture) {
    return <p>Loading picture information.....</p>;
  }

  return (
    /*HTML for confirmed deletion   */
    <div className="container">
      <h2>Delete Picture</h2>
      <p>Are you sure you want to delete this picture?</p>
      <div>
        <img src={picture.pictureUrl} alt={picture.title} style={{ width: '200px' }} />
        <h3>{picture.title}</h3>
      </div>
      <div className="mt-3">
        <button onClick={handleDelete} className="btn btn-danger me-3">Delete</button>
        <button onClick={() => navigate(source)} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default  PictureDelete;
