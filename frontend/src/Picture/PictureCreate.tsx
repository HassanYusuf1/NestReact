import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPicture } from './PictureService';

const PictureCreate: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPictureFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pictureFile) {
      alert('Please select a picture to upload.');
      return;
    }

    try {
      const formData = new FormData(); //Uses formdata to create a picture
      formData.append('Title', title);
      formData.append('Description', description);
      formData.append('PictureFile', pictureFile); // PICTURE FILE MUST MATCH BACKEND

      await createPicture(formData); //Method for creation from service
      navigate('/picture/mypage');
    } catch (error) {
      console.error('Error creating picture:', error);
    }
  };

  return (
    /* Form for creating picture*/
    <div className="container">
      <h2>Upload New Image</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="PictureFile">Select Image</label>
          <input
            type="file"
            id="PictureFile"
            onChange={handleFileChange}
            className="form-control"
            required
          />
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">Upload</button>
          <button
            type="button"
            className="btn btn-secondary ms-3"
            onClick={() => navigate('/picture/mypage')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PictureCreate;
