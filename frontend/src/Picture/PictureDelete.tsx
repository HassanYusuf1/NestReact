import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPictureById, deletePicture } from './PictureService';
import { Picture } from '../types/picture'; // Sørg for at du har riktig Picture-type

const DeletePicturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [picture, setPicture] = useState<Picture | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Henter bildet med gitt ID når komponenten lastes inn
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const fetchedPicture = await fetchPictureById(Number(id));
          setPicture(fetchedPicture);
        } catch (err) {
          console.error(`Error fetching picture with id ${id}:`, err);
          setError('Kunne ikke hente bildeinformasjon. Vennligst prøv igjen senere.');
        }
      };
      fetchData();
    }
  }, [id]);

  // Funksjon for å håndtere sletting av bildet
  const handleDelete = async () => {
    if (!window.confirm('Er du sikker på at du vil slette dette bildet?')) {
      return;
    }

    try {
      await deletePicture(Number(id));
      navigate('/pictures'); // Navigerer tilbake til oversikten etter sletting
    } catch (error) {
      console.error(`Feil ved sletting av bildet med id ${id}:`, error);
      setError('Kunne ikke slette bildet. Vennligst prøv igjen senere.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!picture) {
    return <p>Laster bildeinformasjon...</p>;
  }

  return (
    <div className="container">
      <h2>Slett Bilde</h2>
      <p>Er du sikker på at du vil slette dette bildet?</p>
      <div>
        <img src={picture.pictureUrl} alt={picture.title} style={{ width: '200px' }} />
        <h3>{picture.title}</h3>
      </div>
      <div className="mt-3">
        <button onClick={handleDelete} className="btn btn-danger me-3">Slett</button>
        <button
          onClick={() => navigate('/pictures')}
          className="btn btn-secondary"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
};

export default DeletePicturePage;
