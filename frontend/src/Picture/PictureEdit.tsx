import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fetchPictureById, updatePicture } from './PictureService';
import { Picture } from '../types/picture';

const PictureEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [picture, setPicture] = useState<Picture | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');


  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get('source') || '/picture/grid';

  useEffect(() => {
    const loadPicture = async () => {
      try {
        if (id) {
          const data = await fetchPictureById(Number(id)); //Uses a method for fetching chosen picture from service
          setPicture(data);
          setTitle(data.title || '');
          setDescription(data.description || '');
        }
      } catch (error) {
        console.error(`Error fetching picture with id ${id}:`, error);
      }
    };
    loadPicture();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id && picture) {
        const updatedPicture = {
          pictureId: picture.pictureId,
          title,
          description,
          uploadDate: picture.uploadDate,
          userName: picture.userName
        };
        await updatePicture(Number(id), updatedPicture);
        navigate(source); 
      }
    } catch (error) {
      console.error(`Error updating picture with id ${id}:`, error);
    }
  };

  if (!picture) {
    return <div>Loading...</div>;
  }

  return (
    /* A HTML 'form' for editing the image which will handle data on submit  */
    <div className="container">
      <h2>Edit Image</h2>
      <form onSubmit={handleSubmit}> 
        <div className="form-group mb-3">
          <label htmlFor="Title">Title</label>
          <input
            type="text"
            id="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} //uses a two way data binding 
            className="form-control"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="Description">Description</label>
          <textarea
            id="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)} //uses a two way data binding
            className="form-control"
            required
          />
        </div>
        
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">Save Changes</button>
          <button
            type="button"
            className="btn btn-secondary ms-3"
            onClick={() => navigate(source)} //navigates to correct source after saving changes
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PictureEdit;
