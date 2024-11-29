import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Note } from '../types/Note';

const API_URL = 'http://localhost:5215';

const headers = {
    'Content-Type': 'application/json',
  };

    //BRUKT
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

  //BRUKT
export const fetchNoteById = async (noteId: string): Promise<Note> => {
    try {
      const response = await fetch(`${API_URL}/api/noteapi/${noteId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Note = await response.json(); // Explicitly type the data as Note
      console.log(data); // Optional logging
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw new Error('Failed to fetch note.');
    }
  };

  export const fetchNoteByIdForDisplay = async (noteId: string): Promise<Note> => {
    try {
      const response = await fetch(`${API_URL}/api/noteapi/${noteId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch note.');
      }
      const data: Note = await response.json(); // Explicitly type the response as Note
      return data;
    } catch (error) {
      console.error('Error fetching note:', error);
      throw new Error('Failed to fetch note.');
    }
  };

//BRUKT
export const fetchAllNotes = async (): Promise<Note[]> => {
    try {
      const response = await fetch(`${API_URL}/api/NoteAPI/GetNotes`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Note[] = await response.json(); // Explicitly type the data as Note[]
      console.log(data); // Optional: Remove or handle logging in production
      return data;
    } catch (error) {
      console.error(`There was a problem with the fetch operation: ${(error as Error).message}`);
      throw new Error('Failed to fetch notes.'); // Re-throw error to handle in the calling function
    }
  };

  export const fetchMyNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/PictureAPI/mypage`, {
        headers: {
          ...headers,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching user pictures:', error);
      throw error;
    }
  };

  
  