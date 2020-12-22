const httpStatus = require("http-status");

class APIError extends Error {
  constructor({ message, status = httpStatus.INTERNAL_SERVER_ERROR }) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

module.exports = APIError;
