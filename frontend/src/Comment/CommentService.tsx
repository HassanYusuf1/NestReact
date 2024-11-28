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
export const fetchComments = async () => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/allcomments`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Get comment by id
export const fetchCommentById = async (commentId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/details/${commentId}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching comment with id ${commentId}:`, error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/delete/${commentId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting comment with id ${commentId}:`, error);
    throw error;
  }
};
