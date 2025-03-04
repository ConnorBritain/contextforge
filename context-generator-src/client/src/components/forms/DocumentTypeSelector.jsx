import React from 'react';
import '../../styles/forms.css';

/**
 * Component for selecting the type of document to generate
 */
const DocumentTypeSelector = ({ selectedType, onSelectType, onNext }) => {
  const documentTypes = [
    {
      id: 'businessProfile',
      title: 'Business Dimensional Profile',
      description: 'A detailed business context document that enables AI systems to generate outputs precisely aligned with your unique business model, market position, offerings, and strategic objectives.',
      icon: '📈',
      recommendedFor: 'AI implementation teams, business strategists leveraging AI tools, consultants optimizing AI workflows'
    },
    {
      id: 'targetMarketAudience',
      title: 'Target Market Audience Profile',
      description: 'A comprehensive analysis of your ideal customer segments for semantically calibrating AI systems to accurately understand and target your specific audience demographics, psychographics, behaviors, and needs.',
      icon: '📊',
      recommendedFor: 'Marketing teams working with AI, digital marketers using LLMs, customer insight specialists'
    },
    {
      id: 'styleGuide',
      title: 'AI Style Guide',
      description: 'Advanced AI calibration document for consistently aligning AI-generated content with your brand voice, terminology preferences, and communication standards across all platforms.',
      icon: '📝',
      recommendedFor: 'Content teams using generative AI, brand managers implementing AI assistants, AI prompt engineers'
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