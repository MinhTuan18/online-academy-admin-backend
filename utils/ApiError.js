class ApiError extends Error {
  constructor(message, statusCode, stack = '') {
    super(message);
    this.name = 'ApiError';
    this.message = message;
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
