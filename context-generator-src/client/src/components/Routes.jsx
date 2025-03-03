import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FormWizardPage from '../pages/FormWizardPage';
import DocumentResultPage from '../pages/DocumentResultPage';
import SavedDocumentsPage from '../pages/SavedDocumentsPage';

/**
 * Application routing configuration
 */
const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<FormWizardPage />} />
      <Route path="/document-result" element={<DocumentResultPage />} />
      <Route path="/saved" element={<SavedDocumentsPage />} />
      
      {/* Redirect all other routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
};

export default Routes;