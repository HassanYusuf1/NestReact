import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Note } from '../types/Note';

const API_URL = 'http://localhost:5215';

export const handleResponse = async (response: Response) => {
    if (response.ok) {
      if (response.status === 204) {
        return null;
      }
      return response.json();
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Something went wrong');
    }
  };

export const fetchAllNotes = async () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]); // State for notes, typed as an array of Note
    const [loading, setLoading] = useState<boolean>(false); // State for loading, typed as boolean
    const [error, setError] = useState<string | null>(null); // State for error, typed as string or null

    setLoading(true); // Set loading to true when starting the fetch
    setError(null);   // Clear any previous errors

    try {
      const response = await fetch(`${API_URL}/api/NoteAPI/GetNotes`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Note[] = await response.json(); // Explicitly type the data as Note[]
      setNotes(data);
      console.log(data);
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${(error as Error).message}`);
      setError('Failed to fetch items.');
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };

export const fetchNoteById = async () => {
    const navigate = useNavigate();
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // State for loading, typed as boolean
    const [error, setError] = useState<string | null>(null); // State for error, typed as string or null
    const { noteId } = useParams<{ noteId: string }>(); // Get noteId from the URL
    try {
      const response = await fetch(`${API_URL}/api/noteapi/${noteId}`); // default Get
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setNote(data);
    } catch (error) {
      setError('Failed to fetch note');
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setLoading(false);
    }
  };

export const fetchNoteByIdForDisplay = async () => {
    const navigate = useNavigate(); // Create a navigate function
    const [error, setError] = useState<string | null>(null);
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { noteId } = useParams<{ noteId: string }>();

    const id = noteId; // Fallback to a default ID (e.g., "1")
    try {
      const response = await fetch(`${API_URL}/api/noteapi/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch note.");
      }
      const data = await response.json();
      setNote(data);
    } catch (error) {
      setError("Failed to fetch note");
    } finally {
      setLoading(false);
    }
  };

  
  