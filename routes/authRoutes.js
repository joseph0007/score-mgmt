const express = require('express');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.route('/generate-otp').post(authController.generateOtp);
Router.route('/register').post(authController.registerUser);

module.exports = Router;
