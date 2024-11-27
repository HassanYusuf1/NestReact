import API_URL from '../apiConfig';

const headers = {
  'Content-Type': 'application/json',
};

// Handle server responses
const handleResponse = async (response: Response) => {
  if (response.ok) {
    if (response.status === 204) { // No content to return
      return null;
    }
    return response.json();
  } else {
    const errorText = await response.text();
    throw new Error(errorText || 'Something went wrong');
  }
};

// Get all pictures
export const fetchPictures = async () => {
  try {
    const response = await fetch(`${API_URL}/api/pictureapi/picture`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching pictures:', error);
    throw error;
  }
};

// Get pictures for the current user
export const fetchMyPictures = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/pictureapi/mypage`, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user pictures:', error);
    throw error;
  }
};

// Get picture by id
export const fetchPictureById = async (pictureId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/pictureapi/details/${pictureId}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching picture with id ${pictureId}:`, error);
    throw error;
  }
};

// Create a new picture
export const createPicture = async (picture: any, token: string) => {
  try {
    const formData = new FormData();
    formData.append('title', picture.title);
    formData.append('description', picture.description);
    if (picture.pictureUrl) {
      formData.append('pictureUrl', picture.pictureUrl);
    }

    const response = await fetch(`${API_URL}/api/pictureapi/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating picture:', error);
    throw error;
  }
};

// Update an existing picture
export const updatePicture = async (pictureId: number, updatedPicture: any, token: string) => {
  try {
    const formData = new FormData();
    formData.append('title', updatedPicture.title);
    formData.append('description', updatedPicture.description);
    if (updatedPicture.newPictureUrl) {
      formData.append('newPictureUrl', updatedPicture.newPictureUrl);
    }

    const response = await fetch(`${API_URL}/api/pictureapi/edit/${pictureId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating picture with id ${pictureId}:`, error);
    throw error;
  }
};

// Delete a picture
export const deletePicture = async (pictureId: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/api/pictureapi/deleteconfirmed/${pictureId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting picture with id ${pictureId}:`, error);
    throw error;
  }
};

