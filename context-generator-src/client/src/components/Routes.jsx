import React, { useContext } from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import HomePage from '../pages/HomePage';
import FormWizardPage from '../pages/FormWizardPage';
// DocumentResultPage removed
// import DocumentResultPage from '../pages/DocumentResultPage';
import SavedDocumentsPage from '../pages/SavedDocumentsPage';
import UsageDashboardPage from '../pages/UsageDashboardPage';
import AboutPage from '../pages/AboutPage';
import LoginPage from '../pages/LoginPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
// Placeholder for the new page to view generation status/results
import DocumentStatusPage from '../pages/DocumentStatusPage'; 

/**
 * Protected Route Component
 */
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        // Optional: Show a loading spinner while checking auth state
        return <div>Loading...</div>;
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return children;
};


/**
 * Application routing configuration
 */
const AppRoutes = () => {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Protected Routes (require authentication) */}
      <Route 
        path="/forge"
        element={
          <ProtectedRoute>
            <FormWizardPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/saved"
        element={
          <ProtectedRoute>
            <SavedDocumentsPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/usage"
        element={
          <ProtectedRoute>
            <UsageDashboardPage />
          </ProtectedRoute>
        }
      />
       {/* New route for viewing document status/result */}
       <Route 
        path="/document-status/:docId" 
        element={
            <ProtectedRoute>
                <DocumentStatusPage />
            </ProtectedRoute>
        }
      />
      
      {/* Removed /document-result route */}
      {/* <Route path="/document-result" element={<DocumentResultPage />} /> */}

      {/* Keep the old /create route temporarily? Or remove. */}
      <Route path="/create" element={<Navigate to="/forge" replace />} />

      {/* Fallback: Redirect unknown paths to home or a 404 component */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
};

export default AppRoutes;
