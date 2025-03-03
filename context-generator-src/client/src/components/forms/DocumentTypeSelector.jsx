import React from 'react';
import '../../styles/forms.css';

/**
 * Component for selecting the type of document to generate
 */
const DocumentTypeSelector = ({ selectedType, onSelectType, onNext }) => {
  const documentTypes = [
    {
      id: 'targetMarketAudience',
      title: 'Target Market Audience Profile',
      description: 'A comprehensive analysis of your ideal customer segments, including demographics, psychographics, behaviors, and needs.',
      icon: '=e',
      recommendedFor: 'Marketing teams, startup founders, product managers'
    },
    {
      id: 'businessProfile',
      title: 'Business Dimensional Profile',
      description: 'A detailed business strategy document covering market analysis, offerings, business model, operations, and growth projections.',
      icon: '=Ê',
      recommendedFor: 'Business strategists, consultants, entrepreneurs'
    },
    {
      id: 'styleGuide',
      title: 'AI Style Guide',
      description: 'A comprehensive guide for ensuring consistent AI communications that align with your brand voice, audience, and business objectives.',
      icon: '<¨',
      recommendedFor: 'Brand managers, content teams, AI implementation specialists'
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