import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPicture } from './PictureService';

const CreatePicturePage: React.FC = () => {
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
      const picture = { title, description, pictureUrl: pictureFile };
      await createPicture(picture);
      navigate('/pictures'); // Naviger tilbake til listen etter vellykket opprettelse
    } catch (error) {
      console.error('Error creating picture:', error);
    }
  };

  return (
    <div>
      <h2>Create New Picture</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Picture:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">Create Picture</button>
      </form>
    </div>
  );
};

export default CreatePicturePage;
