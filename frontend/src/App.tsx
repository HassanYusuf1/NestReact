import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import CreatePicturePage from './Picture/PictureCreate';
import DeletePicturePage from './Picture/PictureDelete';
import PictureDetails from './Picture/PictureDetails';
import PictureGrid from './Picture/PictureGrid';
import PictureMyPage from './Picture/PictureMyPage';

const App: React.FC = () => {
  return (
    <Container>
      <Router>
        <Routes>
          <Route path="/pictures" element={<PictureGrid />} />
          <Route path="/pictures/create" element={<CreatePicturePage />} />
          <Route path="/pictures/:id" element={<PictureDetails />} />
          <Route path="/pictures/:id/delete" element={<DeletePicturePage />} />
          <Route path="/mypage" element={<PictureMyPage />} />
          <Route path="*" element={<Navigate to="/pictures" replace />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
