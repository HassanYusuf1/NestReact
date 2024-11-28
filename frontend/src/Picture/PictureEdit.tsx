import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPictureById, updatePicture } from './PictureService';
import { Picture } from '../types/picture';

const PictureEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [picture, setPicture] = useState<Picture | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    const loadPicture = async () => {
      try {
        if (id) {
          const data = await fetchPictureById(Number(id));
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
        // Oppdater tittel og beskrivelse uten å laste opp ny fil
        const updatedPicture = {
          pictureId: picture.pictureId,
          title,
          description,
          uploadDate: picture.uploadDate,  // Beholder opplastingsdatoen
          userName: picture.userName       // Beholder brukernavnet
        };
        await updatePicture(Number(id), updatedPicture);
        navigate('/pictures');
      }
    } catch (error) {
      console.error(`Error updating picture with id ${id}:`, error);
    }
  };

  if (!picture) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Edit Image</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="Title">Title</label>
          <input
            type="text"
            id="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="Description">Description</label>
          <textarea
            id="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">Save Changes</button>
          <button
            type="button"
            className="btn btn-secondary ms-3"
            onClick={() => navigate('/pictures')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PictureEditPage;
