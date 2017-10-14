'use strict';

module.exports = function sendError() {
  return (err, req, res, next)=> { // eslint-disable-line no-unused-vars
    global.log.error(err);

    const statusCode = (()=> {
      if (typeof err.code === 'number' && err.code >= 400 && err.code < 600) {
        return err.code;
      }
      return 500;
    })();

    const message = (()=> {
      if (err.message) {
        return err.message;
      }

      return 'Server error';
    })();

    if (res.cancelClientCache) {
      res.cancelClientCache();
    }

    return res.status(statusCode).json({
      code: statusCode,
      errorMessage: message,
    });
  };
};
