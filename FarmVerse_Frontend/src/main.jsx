import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Import Bootstrap first for base styles
import 'bootstrap/dist/css/bootstrap.min.css';
// Then import our custom styles to override Bootstrap and add our theme
import './custom.css'; 

// Render the main App component, wrapped in the Router
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

