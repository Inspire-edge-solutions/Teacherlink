// Common validation functions
export const validations = {
    // Email validation
    isValidEmail: (email) => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email);
    },
  
    // Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
    isValidPassword: (password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return passwordRegex.test(password);
    },
  
    // Phone number validation (basic example)
    isValidPhone: (phone) => {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(phone);
    },
  
    // Required field validation
    isRequired: (value) => {
      return value !== null && value !== undefined && value.toString().trim() !== '';
    },
  
    // Min length validation
    minLength: (value, min) => {
      return value && value.length >= min;
    },
  
    // Max length validation
    maxLength: (value, max) => {
      return value && value.length <= max;
    },
  
    // URL validation
    isValidUrl: (url) => {
      try {
        new URL(url);
        return true;
      } catch (error) {
        return false;
      }
    },
  
    // Number validation
    isNumber: (value) => {
      return !isNaN(value) && typeof Number(value) === 'number';
    },
  
    // Date validation
    isValidDate: (date) => {
      const d = new Date(date);
      return d instanceof Date && !isNaN(d);
    },
  
    // File size validation (in MB)
    isValidFileSize: (file, maxSizeMB) => {
      return file.size <= maxSizeMB * 1024 * 1024;
    },
  
    // File type validation
    isValidFileType: (file, allowedTypes) => {
      return allowedTypes.includes(file.type);
    }
  };
  
  // Error messages
  export const errorMessages = {
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase and 1 number',
    phone: 'Please enter a valid phone number',
    required: 'This field is required',
    minLength: (min) => `Must be at least ${min} characters`,
    maxLength: (max) => `Must not exceed ${max} characters`,
    url: 'Please enter a valid URL',
    number: 'Please enter a valid number',
    date: 'Please enter a valid date',
    fileSize: (size) => `File size must not exceed ${size}MB`,
    fileType: 'File type not supported'
  };