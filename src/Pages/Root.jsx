// src/Root.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Root.css'; // Optional: Import specific CSS for the Root component

function Root() {
  return (
    <div className="root-container">
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/form">Form</Link>
          </li>
          <li>
            <Link to="/information">Information</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet /> {/* Renders the matched child route */}
      </main>
    </div>
  );
}

export default Root;
