import React from 'react';

/**
 * Reusable form field component for different input types
 */
const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  options = [],
  multiline = false,
  rows = 4,
  info = '',
  error = '',
  className = '',
}) => {
  // Determine the input field type based on props
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            name={id}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={`form-textarea ${error ? 'has-error' : ''}`}
          />
        );
      case 'select':
        return (
          <select
            id={id}
            name={id}
            value={value || ''}
            onChange={onChange}
            required={required}
            className={`form-select ${error ? 'has-error' : ''}`}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={id}
            name={id}
            checked={!!value}
            onChange={onChange}
            className="form-checkbox"
          />
        );
      case 'radio-group':
        return (
          <div className="radio-group">
            {options.map((option) => (
              <div key={option.value} className="radio-option">
                <input
                  type="radio"
                  id={`${id}-${option.value}`}
                  name={id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  required={required}
                />
                <label htmlFor={`${id}-${option.value}`}>{option.label}</label>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <input
            type={type}
            id={id}
            name={id}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`form-input ${error ? 'has-error' : ''}`}
          />
        );
    }
  };

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      {renderField()}
      {info && <div className="field-info">{info}</div>}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

export default FormField;