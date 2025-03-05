import React from 'react';
import { Link } from 'react-router-dom';
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
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.BUSINESS_PROFILE],
      aboutLink: "business-profile"
    },
    {
      id: DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE,
      title: DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE],
      description: DOCUMENT_TYPE_DESCRIPTIONS[DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE],
      icon: DOCUMENT_TYPE_ICONS[DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE],
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.TARGET_MARKET_AUDIENCE],
      aboutLink: "target-audience"
    },
    {
      id: DOCUMENT_TYPES.STYLE_GUIDE,
      title: DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.STYLE_GUIDE],
      description: DOCUMENT_TYPE_DESCRIPTIONS[DOCUMENT_TYPES.STYLE_GUIDE],
      icon: DOCUMENT_TYPE_ICONS[DOCUMENT_TYPES.STYLE_GUIDE],
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.STYLE_GUIDE],
      aboutLink: "style-guide"
    },
    {
      id: DOCUMENT_TYPES.PERSONAL_BIO,
      title: DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.PERSONAL_BIO],
      description: DOCUMENT_TYPE_DESCRIPTIONS[DOCUMENT_TYPES.PERSONAL_BIO],
      icon: DOCUMENT_TYPE_ICONS[DOCUMENT_TYPES.PERSONAL_BIO],
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.PERSONAL_BIO],
      aboutLink: "personal-bio"
    },
    {
      id: DOCUMENT_TYPES.OFFER_DOCUMENTATION,
      title: DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.OFFER_DOCUMENTATION],
      description: DOCUMENT_TYPE_DESCRIPTIONS[DOCUMENT_TYPES.OFFER_DOCUMENTATION],
      icon: DOCUMENT_TYPE_ICONS[DOCUMENT_TYPES.OFFER_DOCUMENTATION],
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.OFFER_DOCUMENTATION],
      aboutLink: "offer-documentation"
    },
    {
      id: DOCUMENT_TYPES.SALES_MESSAGING_PLAYBOOK,
      title: DOCUMENT_TYPE_NAMES[DOCUMENT_TYPES.SALES_MESSAGING_PLAYBOOK],
      description: DOCUMENT_TYPE_DESCRIPTIONS[DOCUMENT_TYPES.SALES_MESSAGING_PLAYBOOK],
      icon: DOCUMENT_TYPE_ICONS[DOCUMENT_TYPES.SALES_MESSAGING_PLAYBOOK],
      recommendedFor: DOCUMENT_TYPE_RECOMMENDED_FOR[DOCUMENT_TYPES.SALES_MESSAGING_PLAYBOOK],
      aboutLink: "sales-messaging"
    }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedType) {
      onNext(selectedType);
    }
  };
  
  return (
    <form className="form-container form-container-wide" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Select Document Type</h2>
        <p>Choose the type of document you want to create with our AI-powered system.</p>
      </div>
      
      <div className="document-type-grid">
        {documentTypes.map(type => (
          <div 
            key={type.id}
            className={`document-type-card ${selectedType === type.id ? 'selected' : ''}`}
            onClick={() => {
              onSelectType(type.id);
              onNext(type.id); // Proceed to next step when clicking on card
            }}
          >
            <div className="document-type-icon">{type.icon}</div>
            <h3>{type.title}</h3>
            
            {/* Recommended For section */}
            <div className="document-type-recommended">
              <span>Recommended for:</span> {type.recommendedFor.split(',')[0]}
            </div>
            
            {/* Card buttons container */}
            <div className="document-card-buttons">
              {/* Select button */}
              <div className="document-type-select">
                <input 
                  type="radio"
                  id={type.id}
                  name="documentType"
                  value={type.id}
                  checked={selectedType === type.id}
                  onChange={() => {
                    onSelectType(type.id);
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent bubbling
                />
                <label 
                  htmlFor={type.id}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    onSelectType(type.id);
                    onNext(type.id); // Only navigate on explicit "Select" click
                  }}
                >
                  Select
                </label>
              </div>

              {/* Learn More button */}
              <Link 
                to={`/about#${type.aboutLink}`} 
                className="learn-more-button"
                onClick={(e) => e.stopPropagation()} // Prevent card click
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Next button removed as clicking on document type advances the page */}
    </form>
  );
};

export default DocumentTypeSelector;