import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FormWizardPage from '../pages/FormWizardPage';
import DocumentResultPage from '../pages/DocumentResultPage';
import SavedDocumentsPage from '../pages/SavedDocumentsPage';
import UsageDashboardPage from '../pages/UsageDashboardPage';
import AboutPage from '../pages/AboutPage';
import LoginPage from '../pages/LoginPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';

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
      <Route path="/usage" element={<UsageDashboardPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      {/* Redirect all other routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
};

export default Routes;