import React from 'react';

/**
 * Form section component for grouping related form fields
 */
const FormSection = ({ 
  title, 
  description, 
  children, 
  className = '',
  showDivider = true
}) => {
  return (
    <div className={`form-section ${className}`}>
      {title && <h3 className="section-title">{title}</h3>}
      {description && <p className="section-description">{description}</p>}
      <div className="section-content">
        {children}
      </div>
      {showDivider && <div className="section-divider"></div>}
    </div>
  );
};

export default FormSection;