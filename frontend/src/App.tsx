import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavBar from './shared/NavBar'; 
import CreatePicturePage from './Picture/PictureCreate';
import DeletePicturePage from './Picture/PictureDelete';
import PictureDetails from './Picture/PictureDetails';
import PictureGrid from './Picture/PictureGrid';
import PictureMyPage from './Picture/PictureMyPage';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar /> 
      <Container>
        <Routes>
          <Route path="/pictures" element={<PictureGrid />} />
          <Route path="/pictures/create" element={<CreatePicturePage />} />
          <Route path="/pictures/:id" element={<PictureDetails />} />
          <Route path="/pictures/:id/delete" element={<DeletePicturePage />} />
          <Route path="/picture/mypage" element={<PictureMyPage />} />
          <Route path="*" element={<Navigate to="/pictures" replace />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
