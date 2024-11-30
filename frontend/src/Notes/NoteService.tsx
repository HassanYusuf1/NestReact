import { Note } from '../types/Note';

const API_URL = 'http://localhost:5215';

const headers = {
    'Content-Type': 'application/json',
  };

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

  export const createNote = async (note: Note): Promise<Note> => {
    try {
      const response = await fetch(`${API_URL}/api/NoteAPI/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create note.');
      }
  
      const createdNote = await response.json();
      return createdNote; // Returnerer den opprettede noten
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('There was a problem creating the note.');
    }
  };

export const fetchAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await fetch(`${API_URL}/api/NoteAPI/getnotes`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: Note[] = await response.json();
    console.log('Raw data from API:', data);

    // Convert date to string
    const notesWithParsedDates = data.map((note) => ({
      ...note,
      uploadDate: new Date(note.uploadDate), // Konverter datoen til Date-objekt
    }));

    console.log('Processed data with Date objects:', notesWithParsedDates);
    return notesWithParsedDates;
  } catch (error) {
    console.error(`There was a problem with the fetch operation: ${(error as Error).message}`);
    throw new Error('Failed to fetch notes.');
  }
};
export const updateNote = async (note: Note): Promise<Note> => {
  try {
    const response = await fetch(`${API_URL}/api/NoteAPI/edit/${note.noteId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(note),
    });
    const updatedNote = await handleResponse(response);
    return updatedNote;
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note.');
  }
};

  export const fetchMyNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/NoteApi/mypage`, {
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

  export const deleteNoteById = async (noteId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/NoteAPI/delete/${noteId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete the note.');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note.');
    }
  };

  
  