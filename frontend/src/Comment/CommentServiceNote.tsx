import API_URL from '../apiConfig';
import { Comment } from '../types/Comment';

const headers = {
  'Content-Type': 'application/json',
};

// Handle server responses
const handleResponse = async (response: Response) => {
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

// Fetch comments for a specific note
export const fetchCommentsNote = async (noteId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/getcomments/note/${noteId}`, {
      method: 'GET',
      headers: {
        ...headers,
      },
    });

    const data = await handleResponse(response);

    // Konverter uploadDate fra streng til Date-objekt
    const commentsWithParsedDates = data.map((comment: Comment) => ({
      ...comment,
      uploadDate: new Date(comment.uploadDate), // Konverter datoen
    }));

    return commentsWithParsedDates;
  } catch (error) {
    console.error(`Error fetching comments for note with id ${noteId}:`, error);
    throw error;
  }
};



// Create a comment associated with a note
export const createCommentNote = async (commentData: {
  noteId: number;
  commentDescription: string;
  userName: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/create`, {
      method: 'POST',
      headers: {
        ...headers,
      },
      body: JSON.stringify({
        ...commentData,
        pictureId: null, // Ensures we are associating with a note only
      }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating comment for note:', error);
    throw error;
  }
};

// Edit an existing comment for a note
export const editCommentForNote = async (commentId: number, updatedCommentData: { commentDescription: string }) => {
  if (!updatedCommentData.commentDescription) {
    throw new Error('Comment description cannot be empty');
  }

  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/edit/${commentId}`, {
      method: 'PUT',
      headers: {
        ...headers,
      },
      body: JSON.stringify({
        commentId,
        ...updatedCommentData,
      }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error editing comment with id ${commentId}:`, error);
    throw error;
  }
};

// Delete a comment by ID (Note-specific)
export const deleteCommentForNote = async (commentId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/delete/${commentId}`, {
      method: 'DELETE',
      headers: {
        ...headers,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting comment with id ${commentId}:`, error);
    throw error;
  }
};
