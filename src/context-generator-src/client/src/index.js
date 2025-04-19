import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import apiService from './services/apiService';

// Import CSS files
import './styles/global.css';
import './styles/forms.css';
import './styles/document.css';
import './styles/dashboard.css';

// Pre-detect the server port before rendering
// This helps ensure API calls work correctly with any server port
apiService._detectServerPort().then(() => {
  console.log('Server port detection completed, rendering app...');
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(error => {
  console.error('Failed to detect server port:', error);
  // Render the app anyway to avoid a blank screen
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});