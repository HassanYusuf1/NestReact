import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import NavMenu from './shared/NavBar'; 
import HomePage from './Home/Home';
import CreatePicturePage from './Picture/PictureCreate';
import DeletePicturePage from './Picture/PictureDelete';
import PictureDetails from './Picture/PictureDetails';
import PictureGrid from './Picture/PictureGrid';
import PictureMyPage from './Picture/PictureMyPage';
import PictureEditPage from './Picture/PictureEdit'; 
import NotesPage from './Notes/NotesPage';
import NotesCreate from './Notes/NotesCreate';
import NotesEdit from './Notes/NotesEdit';
import NoteDisplay from './Notes/NoteDisplay';
import CommentEditPage from './Comment/CommentEdit';
import NotesMyPage from './Notes/NotesMyPage';

const App: React.FC = () => {
  return (
    <Router>
      <NavMenu /> 
      <Container>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />

          {/* Pictures Routes */}
          <Route path="/pictures" element={<PictureGrid />} />
          <Route path="/pictures/create" element={<CreatePicturePage />} />
          <Route path="/pictures/:id" element={<PictureDetails />} />
          <Route path="/pictures/:id/edit" element={<PictureEditPage />} />
          <Route path="/pictures/:id/delete" element={<DeletePicturePage />} />
          <Route path="/picture/mypage" element={<PictureMyPage />} />

          {/* Notes Routes */}
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notescreate" element={<NotesCreate />} />
          <Route path="/edit/:noteId" element={<NotesEdit />} />
          <Route path="/notesdetails/:noteId" element={<NoteDisplay />} />
          <Route path="/commenteditnote/:commentId" element={<CommentEditPage />} />
          <Route path="/notes/mypage" element={<NotesMyPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
