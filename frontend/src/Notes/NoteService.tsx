import { Note } from "../types/Note";
import API_URL from "../apiConfig";

const headers = {
  "Content-Type": "application/json",
};

export const handleResponse = async (response: Response) => { //handles response and displays it
  if (response.ok) {
    if (response.status === 204) {
      return null;
    }
    return response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || "Something went wrong");
  }
};

export const fetchNoteById = async (noteId: string): Promise<Note> => { //Method for fetching note by its id
  try {
    const response = await fetch(`${API_URL}/api/noteapi/${noteId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: Note = await response.json(); //Explicitly type the data as Note
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw new Error("Failed to fetch note.");
  }
};

export const fetchNoteByIdForDisplay = async ( //fetches note for display
  noteId: string
): Promise<Note> => {
  try {
    const response = await fetch(`${API_URL}/api/noteapi/${noteId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch note.");
    }
    const data: Note = await response.json(); //Explicitly type the response as Note
    return data;
  } catch (error) {
    console.error("Error fetching note:", error);
    throw new Error("Failed to fetch note.");
  }
};

export const createNote = async (note: Note): Promise<Note> => { //method for creating a note
  try {
    const response = await fetch(`${API_URL}/api/NoteAPI/Create`, { //using api url to fetch
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      throw new Error("Failed to create note.");
    }

    const createdNote = await response.json();
    return createdNote; // returns the note after post
  } catch (error) {
    console.error("Error creating note:", error);
    throw new Error("There was a problem creating the note.");
  }
};

export const fetchAllNotes = async (): Promise<Note[]> => { //fetch all notes 
  try {
    const response = await fetch(`${API_URL}/api/NoteAPI/getnotes`); 
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: Note[] = await response.json();

    const notesWithParsedDates = data.map((note) => {
      const localDate = new Date(note.uploadDate);
      localDate.setMinutes(
        localDate.getMinutes() - localDate.getTimezoneOffset()
      );
      return {
        ...note,
        uploadDate: localDate, //use local time
      };
    });

    return notesWithParsedDates; //returns the parsed data
  } catch (error) {
    console.error(
      `There was a problem with the fetch operation: ${
        (error as Error).message
      }`
    );
    throw new Error("Failed to fetch notes.");
  }
};

export const updateNote = async (note: Note): Promise<Note> => { //Method for creating a note
  try {
    const response = await fetch(`${API_URL}/api/NoteAPI/edit/${note.noteId}`, { //Fetches method from controller
      method: "PUT",
      headers,
      body: JSON.stringify(note),
    });
    const updatedNote = await handleResponse(response); 
    return updatedNote; //Returns the updated note
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error("Failed to update note.");
  }
};

export const fetchMyNotes = async () => { //Fetches the users notes 
  try {
    const response = await fetch(`${API_URL}/api/NoteApi/mypage`, {
      headers: {
        ...headers,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching user pictures:", error);
    throw error;
  }
};

export const deleteNoteById = async (noteId: string): Promise<void> => { //deletes a note by its noteid
  try {
    const response = await fetch(`${API_URL}/api/NoteAPI/delete/${noteId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to delete the note.");
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error("Failed to delete note.");
  }
};
