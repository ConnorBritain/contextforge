import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
// DocumentProvider removed as it's no longer needed
// import { DocumentProvider } from '../context/DocumentContext';
import Header from './common/Header';
import Footer from './common/Footer';
import AppRoutes from './Routes'; // Renamed Routes to AppRoutes for clarity
import { Toaster } from 'react-hot-toast'; // Import Toaster
import '../styles/global.css';

/**
 * Main application component
 */
const App = () => {
  return (
    <Router>
      {/* AuthProvider wraps everything needing authentication context */}
      <AuthProvider>
        {/* DocumentProvider removed */}
        <div className="app-container">
          <Header />
          <main className="main-content">
            {/* Render application routes */}
            <AppRoutes /> 
          </main>
          <Footer />
        </div>
        {/* Toaster for displaying notifications */}
        <Toaster 
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
                // Define default options
                duration: 5000,
                style: {
                background: '#363636',
                color: '#fff',
                },
                // Default options for specific types
                success: {
                duration: 3000,
                theme: {
                    primary: 'green',
                    secondary: 'black',
                },
                },
            }}
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
