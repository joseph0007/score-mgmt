const moment = require("moment");
const { mongoUpdate, mongoFind } = require("../databases/mongo");
const { encrypt } = require("../utils/helpers");
const mongoCollections = require("../utils/mongoCollectionConstants");

const {
  OTP_EXPIRY = 1
} = process.env;

exports.generateOtp = async (request, response) => {
  return new Promise(async ( resolve, reject ) => {
    if( typeof request.body !== 'object' || !request.body.mobileNumber ) {
      reject({
        statusCode: 400,
        status: false,
        message: `Mobile number not provided.`,
        error: ''
      });
      return;
    }

    const {
      mobileNumber
    } = request.body;

    const user = await mongoFind(mongoCollections.User, { mobileNumber });

    if( user && user[0] && user[0].verified ) {
      reject({
        statusCode: 400,
        status: false,
        message: `User already exists.`,
        error: ''
      });
      return;
    }

    const otpGeneratedTime = parseInt(moment().add(5, 'seconds').add(OTP_EXPIRY, 'minutes').format("x"), 10);

    const otp = 1234; // hardcoded otp
    const updateData = {
      mobileNumber,
      otp,
      otpGeneratedTime,
      verified: false
    };
  
    await mongoUpdate(mongoCollections.User, { mobileNumber }, updateData, { upsert: true });

    resolve({
      statusCode: 200,
      status: true,
      message: `Otp generated successfully.`
    });
  });
}

exports.registerUser = async (request, response) => {
  return new Promise(async ( resolve, reject ) => {
    if( 
      typeof request.body !== 'object' || 
      !request.body.mobileNumber || 
      !request.body.name || 
      !request.body.dob || 
      !request.body.emailId ||
      !request.body.otp   
    ) {
      reject({
        statusCode: 400,
        status: false,
        message: `Please provide the following fields => mobileNumber, name, dob, emailId, otp.`,
        error: ''
      });
      return;
    }

    const {
      mobileNumber,
      name,
      dob,
      emailId,
      otp,
    } = request.body;

    const user = await mongoFind(mongoCollections.User, { mobileNumber });
    
    if( !user || !Array.isArray(user) || !user[0] ) {
      reject({
        statusCode: 400,
        status: false,
        message: `Otp not generated. Please generate otp.`,
        error: ''
      });
      return;
    }

    if( user[0].verified ) {
      reject({
        statusCode: 400,
        status: false,
        message: `User already exists.`,
        error: ''
      });
      return;
    }

    if( !user[0].otp ) {
      reject({
        statusCode: 400,
        status: false,
        message: `Otp not generated. Please generate otp.`,
        error: ''
      });
      return;
    }

    const {
      otp: otpUser,
      otpGeneratedTime
    } = user[0];

    if( otpUser !== otp || parseInt(moment().format("x"), 10) > otpGeneratedTime ) {
      reject({
        statusCode: 400,
        status: false,
        message: `Otp incorrect or expired.`,
        error: ''
      });
      return;
    }

    const userData = await mongoFind(mongoCollections.User, {}, { userId: 1 }, { userId: -1 }, 0, 1);

    let userId = 1;
    if( Array.isArray(userData) && userData[0] && userData[0].userId ) {
      userId = parseInt(userData[0].userId, 10) + 1;
    }

    const updateData = {
      userId,
      name,
      dob,
      emailId,
      mobileNumber,
      otp: 0,
      otpGeneratedTime: 0,
      verified: true,
      status: 1,
      insertAt: parseInt(moment().format("x"), 10)
    }

    await mongoUpdate(mongoCollections.User, { mobileNumber }, updateData, { upsert: true });

    resolve({
      statusCode: 200,
      status: true,
      message: `User created successfully.`,
      data: {
        userId: await encrypt(`${userId}`)
      }
    });
  });
}