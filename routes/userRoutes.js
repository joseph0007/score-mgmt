const express = require('express');
const userController = require('../controllers/userController');

const Router = express.Router();

Router.route('/score').post(userController.updateScore);
Router.route('/total-score').post(userController.totalScoreRank);
Router.route('/weekly-score').post(userController.weeklyAggregate);

module.exports = Router;
