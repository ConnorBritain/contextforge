import React from 'react';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_NAMES, DOCUMENT_TYPE_ICONS, DOCUMENT_TYPE_DESCRIPTIONS, DOCUMENT_TYPE_RECOMMENDED_FOR } from '../../constants/documentTypes';
import '../../styles/forms.css';

/**
 * Component for selecting the type of document to generate
 */
const DocumentTypeSelector = ({ selectedType, onSelectType, onNext }) => {
  const documentTypes = [
    {
      id: DOCUMENT_TYPES.BUSINESS_PROFILE,
      title: DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.BUSINESS_PROFILE],
      description: DOCUMENT_TYPE_DESCRIPTIONS[DOCUMENT_TYPES.BUSINESS_PROFILE],
      icon: DOCUMENT_TYPE_ICONS[DOCUMENT_TYPES.BUSINESS_PROFILE],
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.BUSINESS_PROFILE]
    },
    {
      id: DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE,
      title: DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE],
      description: DOCUMENT_TYPE_DESCRIPTIONS[DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE],
      icon: DOCUMENT_TYPE_ICONS[DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE],
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE]
    },
    {
      id: DOCUMENT_TYPES.STYLE_GUIDE,
      title: DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.STYLE_GUIDE],
      description: DOCUMENT_TYPE_DESCRIPTIONS[DOCUMENT_TYPES.STYLE_GUIDE],
      icon: DOCUMENT_TYPE_ICONS[DOCUMENT_TYPES.STYLE_GUIDE],
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.STYLE_GUIDE]
    }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedType) {
      onNext(selectedType);
    }
  };
  
  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Select Document Type</h2>
        <p>Choose the type of document you want to generate.</p>
      </div>
      
      <div className="document-type-grid">
        {documentTypes.map(type => (
          <div 
            key={type.id}
            className={`document-type-card ${selectedType === type.id ? 'selected' : ''}`}
            onClick={() => onSelectType(type.id)}
          >
            <div className="document-type-icon">{type.icon}</div>
            <h3>{type.title}</h3>
            <p>{type.description}</p>
            <div className="document-type-recommended">
              <span>Recommended for:</span> {type.recommendedFor}
            </div>
            
            <div className="document-type-select">
              <input 
                type="radio"
                id={type.id}
                name="documentType"
                value={type.id}
                checked={selectedType === type.id}
                onChange={() => onSelectType(type.id)}
              />
              <label htmlFor={type.id}>Select</label>
            </div>
          </div>
        ))}
      </div>
      
      <div className="form-navigation">
        <button 
          type="submit" 
          className="next-button"
          disabled={!selectedType}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default DocumentTypeSelector;