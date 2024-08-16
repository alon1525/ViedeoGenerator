// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Pages/Root.jsx';
import Form from './Pages/Form.jsx';
import Information from './Pages/Information.jsx';
import ErrorPage from './Pages/ErrorPage.jsx';
import './App.css'; // Import your CSS for overall styling

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // Root component with <Outlet />
    errorElement: <ErrorPage />, // Error page for handling errors
    children: [
      { index: true, element: <Form /> },
      { path: "information", element: <Information /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
