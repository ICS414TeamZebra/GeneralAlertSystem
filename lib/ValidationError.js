class ValidationError extends Error {
  constructor(errors) {
    super();
    this.name = this.constructor.name;
    this.errors = errors;
  }
  get message() {
    if (this.errors.length > 1) {
      return 'Multiple validation errors occurred.';
    } else if (this.errors.length === 1) {
      return 'A validation error occurred.';
    }
    return 'There are no validation errors present.';
  }
  get list() {
    return this.errors;
  }
}

module.exports = ValidationError;
