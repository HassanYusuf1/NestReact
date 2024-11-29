import API_URL from '../apiConfig';
import { Comment } from '../types/Comment'

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
  const url = `${API_URL}/api/CommentAPI/getcomments/note/${noteId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      const errorMessage = errorDetails.message || 'Failed to fetch comments';
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    const data = await response.json();

    // Map the API response to the Comment interface
    return data.map((comment: any): Comment => {
      const isNote = Boolean(comment.noteId); // Check if it belongs to a note

      return {
        commentId: comment.commentId, // Use the commentId provided by the API
        noteId: isNote ? comment.noteId : null, // Set noteId if it exists
        pictureId: isNote ? null : comment.pictureId, // Set pictureId if it exists
        userName: 'Unknown',
        commentDescription: comment.commentDescription || '',
        uploadDate: new Date(comment.uploadDate), // Ensure consistent date format
      };
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Get comment by id
export const NotefetchCommentById = async (commentId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/detailsnote/${commentId}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching comment with id ${commentId}:`, error);
    throw error;
  }
};
