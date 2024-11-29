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
export const fetchComments = async (pictureId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/getcomments/picture/${pictureId}`);
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

// Create a comment
export const createComment = async (commentData: {
  pictureId?: number;
  noteId?: number;
  commentDescription: string;
  userName: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/create`, {
      method: 'POST',
      headers: {
        ...headers,
      },
      body: JSON.stringify(commentData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const editComment = async (commentId: number, updatedCommentData: { commentDescription: string; }) => {
  if (!updatedCommentData.commentDescription) {
    throw new Error("Comment description cannot be empty");
  }
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/edit/${commentId}`, {
      method: 'PUT',
      headers: {
        ...headers,
      },
      body: JSON.stringify({
        commentId, 
        ...updatedCommentData
      }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error editing comment with id ${commentId}:`, error);
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
