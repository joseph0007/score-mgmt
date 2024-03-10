const UserModel = require('../Models/UserModel');
const catchAsync = require('../utils/catchAsync');

exports.updateScore = catchAsync(async (request, response, next) => {
  const result = await UserModel.handleUpdateScore(request, response);

  return response.status(result.statusCode).json(result);
});

exports.totalScoreRank = catchAsync(async (request, response, next) => {
  const result = await UserModel.handleTotalScoreRank(request, response);

  return response.status(result.statusCode).json(result);
});

exports.weeklyAggregate = catchAsync(async (request, response, next) => {
  const result = await UserModel.handleWeeklyAggregate(request, response);

  return response.status(result.statusCode).json(result);
});