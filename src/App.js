// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Form from './Pages/Form.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import './App.css'; // Import your CSS for overall styling

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="*" element={<ErrorPage />} /> {/* Catch-all route for 404 errors */}
      </Routes>
    </Router>
  );
}

export default App;
