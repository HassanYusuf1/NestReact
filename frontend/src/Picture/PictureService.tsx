import API_URL from '../apiConfig';

const headers = {
  'Content-Type': 'application/json',
};

//Handle server responses
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

//Get or fetch all pictures
export const fetchPictures = async () => {
  try {
    const response = await fetch(`${API_URL}/api/PictureAPI/allpictures`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching pictures:', error);
    throw error;
  }
};

//Get pictures for the current user 
export const fetchMyPictures = async () => {
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

//Get picture by its id
export const fetchPictureById = async (pictureId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/PictureAPI/details/${pictureId}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching picture with id ${pictureId}:`, error);
    throw error;
  }
};


//Create a new picture using form data
export const createPicture = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/api/PictureAPI/create`, {
      method: 'POST',
      body: formData, //do not set Content-Type to application json, because its formdata
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    return response.json(); //checking response
  } catch (error) {
    console.error('Error creating picture:', error);
    throw error;
  }
};


//Update an existing picture
export const updatePicture = async (pictureId: number, updatedPicture: any) => {
  try {
    const formData = new FormData(); //uses formdata
    formData.append('PictureId', String(pictureId)); //be sure that the picture id is sent
    formData.append('Title', updatedPicture.title); //Use exact same variables as PictureDto
    formData.append('Description', updatedPicture.description);
    
    if (updatedPicture.newPictureUrl) {
      formData.append('PictureFile', updatedPicture.newPictureUrl); //This must be named 'PictureFile'
    }

    const response = await fetch(`${API_URL}/api/PictureAPI/edit/${pictureId}`, { //uses a put http request
      method: 'PUT',
      body: formData,
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating picture with id ${pictureId}:`, error);
    throw error;
  }
};


//Delete a picture
export const deletePicture = async (pictureId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/PictureAPI/delete/${pictureId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting picture with id ${pictureId}:`, error);
    throw error;
  }
};
