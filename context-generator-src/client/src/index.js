import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { DocumentProvider } from './context/DocumentContext';

// Import CSS files
import './styles/global.css';
import './styles/forms.css';
import './styles/document.css';
import './styles/dashboard.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DocumentProvider>
        <App />
      </DocumentProvider>
    </BrowserRouter>
  </React.StrictMode>
);