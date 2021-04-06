const { ERRORS } = require('./ERRORS');

exports.errorHandler = (error, cb) => {
  let errorCode;
  if (error.isJoi) {
    errorCode = 422;
  } else {
    switch (error.name) {
      case ERRORS.REQUEST_ERROR:
        errorCode = 400;
        break;
      case ERRORS.UNAUTHORIZED:
        errorCode = 401;
        break;
      case ERRORS.NOT_FOUND_ERROR:
        errorCode = 404;
        break;
      case ERRORS.RESOURCE_ERROR:
        errorCode = 409;
        break;
      default:
        errorCode = 500;
        break;
    }
  }
  cb(errorCode, error.message);
};

exports.throwError = (error_name, message) => {
  const e = new Error(message);
  e.name = error_name;
  throw e;
};
