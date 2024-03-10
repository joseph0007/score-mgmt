const AuthModel = require('../Models/AuthModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/helpers');

exports.generateOtp = catchAsync(async (request, response, next) => {
  const result = await AuthModel.generateOtp(request, response);

  return sendResponse(result.statusCode, 'success', response, result);
});

exports.registerUser = catchAsync(async (request, response, next) => {
  const result = await AuthModel.registerUser(request, response);
  
  return sendResponse(result.statusCode, 'success', response, result);
});