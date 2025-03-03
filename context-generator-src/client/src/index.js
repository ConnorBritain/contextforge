import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Import CSS files
import './styles/global.css';
import './styles/forms.css';
import './styles/document.css';
import './styles/dashboard.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);