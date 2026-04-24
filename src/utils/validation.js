// Regular expressions for validation
export const VALIDATION_REGEX = {
  // Password must have at least 8 characters, one uppercase, one lowercase, one number and one special character
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  // Phone must be exactly 10 digits
  phone: /^\d{10}$/,
  // Basic email validation
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Validation messages
export const VALIDATION_MESSAGES = {
  password: {
    required: "Password is required",
    invalid: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
  },
  phone: {
    required: "Phone number is required",
    invalid: "Phone number must be exactly 10 digits"
  },
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email address"
  }
};

// Validation functions
export const validatePassword = (password) => {
  if (!password) return VALIDATION_MESSAGES.password.required;
  if (!VALIDATION_REGEX.password.test(password)) return VALIDATION_MESSAGES.password.invalid;
  return "";
};

export const validatePhone = (phone) => {
  if (!phone) return VALIDATION_MESSAGES.phone.required;
  if (!VALIDATION_REGEX.phone.test(phone)) return VALIDATION_MESSAGES.phone.invalid;
  return "";
};

export const validateEmail = (email) => {
  if (!email) return VALIDATION_MESSAGES.email.required;
  if (!VALIDATION_REGEX.email.test(email)) return VALIDATION_MESSAGES.email.invalid;
  return "";
};