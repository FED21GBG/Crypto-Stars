import React from 'react';

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './Pages/StartPage';
import SignupPage from './Pages/SignupPage';
import LoginPage from './Pages/LoginPage';
import CameraPage from './Pages/CameraPage';
import PhotoAlbumPage from './Pages/PhotoAlbumPage';
import TakenPhotoPage from './Pages/TakenPhotoPage';

function App() {
  return (
    //routar till olika sidor
      <Router>
        <Routes>
          <Route path='/' element={<StartPage />} />
          <Route path='/SignupPage' element={<SignupPage />} />
          <Route path='/LoginPage' element={<LoginPage />} />
          <Route path='/CameraPage' element={<CameraPage />} />
          <Route path='/PhotoAlbumPage' element={<PhotoAlbumPage />} />
          <Route path='/TakenPhotoPage' element={<TakenPhotoPage />} />
        </Routes>
      </Router>
  
  );
}

export default App;
