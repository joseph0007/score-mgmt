const moment = require('moment');
const { mongoFind, mongoInsertOne, mongoAggregate } = require('../databases/mongo');
const { decrypt } = require('../utils/helpers');
const mongoCollections = require('../utils/mongoCollectionConstants');

exports.handleUpdateScore = async (request, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        typeof request.body !== 'object' ||
        !request.body.userId ||
        typeof request.body.score !== 'number'
      ) {
        reject({
          statusCode: 400,
          status: false,
          message: `UserId or score not provided.`,
          error: ''
        });
        return;
      }

      const {
        userId,
        score,
      } = request.body;

      if (score < 50 || score > 500) {
        reject({
          statusCode: 400,
          status: false,
          message: `Score should lie in the range of 50-500.`,
          error: ''
        });
        return;
      }

      const decryptedUserId = parseInt(await decrypt(userId), 10);
      const user = await mongoFind(mongoCollections.User, { userId: decryptedUserId });

      if (!user || !Array.isArray(user) || typeof user[0] !== 'object') {
        reject({
          statusCode: 400,
          status: false,
          message: `User not found.`,
          error: ''
        });
        return;
      }

      const scoreData = await mongoFind(mongoCollections.Score, {
        userId: decryptedUserId,
        insertedAt: {
          $gt: parseInt(moment().startOf("day").format("x"), 10),
          $lte: parseInt(moment().endOf("day").format("x"), 10)
        }
      });


      if (Array.isArray(scoreData) && scoreData.length > 2) {
        reject({
          statusCode: 400,
          status: false,
          message: `Maximum attempts exceeded. Only allowed uptil 3 times.`,
          error: ''
        });
        return;
      }

      const insertData = {
        userId: decryptedUserId,
        score,
        insertedAt: parseInt(moment().format("x"), 10)
      }
      await mongoInsertOne(mongoCollections.Score, insertData);

      resolve({
        statusCode: 200,
        status: true,
        message: `Score registered.`,
        error: ''
      });
    } catch (error) {
      reject({
        statusCode: 400,
        status: false,
        message: `Something went wrong.`,
        error: ''
      });
      return;
    }
  });
}

exports.handleTotalScoreRank = async (request, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        typeof request.body !== 'object' ||
        !request.body.userId
      ) {
        reject({
          statusCode: 400,
          status: false,
          message: `UserId not provided.`,
          error: ''
        });
        return;
      }

      const {
        userId,
      } = request.body;

      const decryptedUserId = parseInt(await decrypt(userId), 10);
      const user = await mongoFind(mongoCollections.User, { userId: decryptedUserId });

      if (!user || !Array.isArray(user) || typeof user[0] !== 'object') {
        reject({
          statusCode: 400,
          status: false,
          message: `User not found.`,
          error: ''
        });
        return;
      }

      const aggregatePipeline = [
        {
         $addFields: {
            regDate: { $toDate: "$insertedAt" }
          }
        },
        {
          $group: {
            "_id": {
              userId: "$userId",
            },
            totalScore: {
              $sum: "$score"
            }
          }
        },
        {
          $project: {
            _id: 0,
            userId: "$_id.userId",
            totalScore: "$totalScore"
          }
        },
        {
          $setWindowFields: {
            sortBy: { totalScore: -1 },
            output: {
              rankScore: {
                $rank: {}
              }
            }
          }
        },
        {
          $match: {
            "userId": decryptedUserId
          }
        }
      ];

      const aggregateData = await mongoAggregate(mongoCollections.Score, aggregatePipeline);

      resolve({
        statusCode: 200,
        status: true,
        message: aggregateData,
        error: ''
      });
    } catch (error) {
      reject({
        statusCode: 400,
        status: false,
        message: `Something went wrong.`,
        error: ''
      });
      return;
    }
  });
}

exports.handleWeeklyAggregate = async (request, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        typeof request.body !== 'object' ||
        !request.body.userId
      ) {
        reject({
          statusCode: 400,
          status: false,
          message: `UserId not provided.`,
          error: ''
        });
        return;
      }

      const {
        userId,
      } = request.body;

      const decryptedUserId = parseInt(await decrypt(userId), 10);
      const user = await mongoFind(mongoCollections.User, { userId: decryptedUserId });

      if (!user || !Array.isArray(user) || typeof user[0] !== 'object') {
        reject({
          statusCode: 400,
          status: false,
          message: `User not found.`,
          error: ''
        });
        return;
      }

      const aggregatePipeline = [
        {
         $addFields: {
            regDate: { $toDate: "$insertedAt" }
          }
        },
        {
          $project: {
            score: 1,
            userId: 1,
            week: { $week: { $subtract: ["$regDate", 86400000 * 4] } },
            dayOfWeek: { $dayOfWeek: ["$regDate"] }
          }
        },
        {
          $group: {
            "_id": {
              userId: "$userId",
              week: "$week"
            },
            totalScore: {
              $sum: "$score"
            }
          }
        },
        {
          $project: {
            _id: 0,
            userId: "$_id.userId",
            weekNo: "$_id.week",
            totalScore: "$totalScore"
          }
        },
        {
          $setWindowFields: {
            partitionBy: "$weekNo",
            sortBy: { totalScore: -1 },
            output: {
              rankScore: {
                $rank: {}
              }
            }
          }
        },
        {
          $match: {
            "userId": decryptedUserId
          }
        },
        {
          $project: {
            userId: 0,
          }
        }
      ];

      const aggregateData = await mongoAggregate(mongoCollections.Score, aggregatePipeline);

      resolve({
        statusCode: 200,
        status: true,
        message: aggregateData,
        error: ''
      });
    } catch (error) {
      reject({
        statusCode: 400,
        status: false,
        message: `Something went wrong.`,
        error: ''
      });
      return;
    }
  });
}