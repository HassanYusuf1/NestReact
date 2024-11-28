import API_URL from '../apiConfig';

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

// Get all comments
export const fetchCommentsNote = async () => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/allnotecomments`);
    return handleResponse(response);
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
