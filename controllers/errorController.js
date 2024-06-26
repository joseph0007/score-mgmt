const { disconnectMongoDb } = require("../databases/mongo");
const { disconnectRedis } = require("../databases/redis");

const {
  IS_AWS_LAMBDA = false
} = process.env;

const sendErrorDev = (err, req, res, isDev) => {

  if( isDev ) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err,
      stack: err.stack,
    });
  }

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  console.log("err ", err);

  if( IS_AWS_LAMBDA === "true" || IS_AWS_LAMBDA === true ) {
    disconnectMongoDb();
    disconnectRedis();
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  err.message = err.message || 'Something went wrong!!';

  if( err.error === 'Unexpected field' ) {
    err.message = "Please provide only 1 file to upload, also do keep the key name as \"file\""
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res, true);
    return;
  }

  sendErrorDev(err, req, res, false);
};
