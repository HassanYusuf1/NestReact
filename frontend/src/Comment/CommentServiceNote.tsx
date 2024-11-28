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


// Create a new comment
export const createCommentNote = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/createcommentnote`, {
      method: 'POST',
      body: formData, // Ikke sett Content-Type til 'application/json' her, fordi vi bruker FormData
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    return response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};


// Update an existing comment
export const updateCommentNote = async (commentId: number, updatedComment: any) => {
  try {
    const formData = new FormData();
    formData.append('CommentId', String(commentId)); // Vær sikker på at CommentId blir sendt
    formData.append('Content', updatedComment.Content);
    
    if (updatedComment.newCommentUrl) {
      formData.append('CommentFile', updatedComment.newCommentUrl); // Merk at dette må være 'CommentFile'
    }

    const response = await fetch(`${API_URL}/api/CommentAPI/editnote/${commentId}`, {
      method: 'PUT',
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating comment with id ${commentId}:`, error);
    throw error;
  }
};


// Delete a comment
export const deleteCommentNote = async (commentId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/CommentAPI/deletenote/${commentId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting comment with id ${commentId}:`, error);
    throw error;
  }
};
