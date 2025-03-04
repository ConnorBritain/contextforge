/**
 * Form validation utilities for the Context Generator application
 */

/**
 * Validates a field against specified rules
 * 
 * @param {string} value - The field value to validate
 * @param {object} rules - Validation rules object
 * @returns {string|null} - Error message or null if valid
 */
export const validateField = (value, rules) => {
  // Required check
  if (rules.required && !value.trim()) {
    return rules.requiredMessage || 'This field is required';
  }
  
  // Minimum length check
  if (rules.minLength && value.trim().length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`;
  }
  
  // Maximum length check
  if (rules.maxLength && value.trim().length > rules.maxLength) {
    return `Cannot exceed ${rules.maxLength} characters`;
  }
  
  // Pattern match check
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.patternMessage || 'Invalid format';
  }
  
  // Custom validation function
  if (rules.validate && typeof rules.validate === 'function') {
    const customError = rules.validate(value);
    if (customError) return customError;
  }
  
  return null;
};

/**
 * Validates an entire form object against a validation schema
 * 
 * @param {object} formData - Form data to validate
 * @param {object} validationSchema - Schema with validation rules for each field
 * @returns {object} - Object with errors for each invalid field
 */
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  
  Object.keys(validationSchema).forEach(fieldName => {
    const value = formData[fieldName] || '';
    const rules = validationSchema[fieldName];
    
    const error = validateField(value, rules);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};

/**
 * Checks if a form has any errors
 * 
 * @param {object} errors - Error object from validateForm
 * @returns {boolean} - True if the form has no errors
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

/**
 * Predefined validation schemas for different form types
 */
export const validationSchemas = {
  businessInfo: {
    businessName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      requiredMessage: 'Business name is required'
    },
    industry: {
      required: true,
      minLength: 2,
      maxLength: 100,
      requiredMessage: 'Industry is required'
    },
    products: {
      required: true,
      minLength: 5,
      maxLength: 200,
      requiredMessage: 'Please describe your products or services'
    },
    businessDescription: {
      required: true,
      minLength: 25,
      maxLength: 1000,
      requiredMessage: 'Business description is required'
    },
    targetAudience: {
      required: true,
      minLength: 15,
      maxLength: 500,
      requiredMessage: 'Target audience information is required'
    }
  },
  
  marketingGoals: {
    primaryGoal: {
      required: true,
      requiredMessage: 'Please select at least one primary marketing goal'
    },
    audienceSize: {
      required: true,
      requiredMessage: 'Audience size is required'
    },
    audienceAge: {
      required: true,
      requiredMessage: 'Audience age range is required'
    },
    audienceGender: {
      required: true,
      requiredMessage: 'Audience gender information is required'
    },
    audienceLocation: {
      required: true,
      requiredMessage: 'Audience location information is required'
    }
  }
};