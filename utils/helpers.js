const crypto = require("node:crypto");
const { disconnectMongoDb } = require("../databases/mongo");
const { disconnectRedis } = require("../databases/redis");

const {
  ENCRYPT_KEY: cryptkey,
  ENCRYPT_IV: iv
} = process.env;

const sendResponse = async (
  statusCode = 200,
  status = 'success',
  res,
  message = {}
) => {
  res.status(statusCode).json({
    status,
    message
  });
};

async function encrypt(text) {
  try {
    var cipher = crypto.createCipheriv('aes-128-cbc', cryptkey, iv);
    var crypted = cipher.update(text, 'utf8', 'base64');
    crypted += cipher.final('base64');
    return crypted;
  } catch (err) {
    console.error('encrypt error', err);
    return null;
  }
}

async function decrypt(encryptdata) {
  try {
    let decipher = crypto.createDecipheriv('aes-128-cbc', cryptkey, iv);
    decipher.setAutoPadding(false);
    let decoded = decipher.update(encryptdata, 'base64', 'utf8');
    return decoded;
  } catch (err) {
    console.error('decrypt error', err);
    return null;
  }
}

function getParsedData(json) {
  if( typeof json !== 'string' ) return json;

  let returnObj = {};
  try {
    returnObj = JSON.parse(json);
  } catch (error) {
    returnObj = {};
  }

  return returnObj;
}

function checkDBConnections() {
  let isMongoConnected = false;
  let isRedisConnected = false;

  if( global.mongoDatabasePool ) {
    isMongoConnected = true;
  }

  if( global.redis ) {
    isRedisConnected = true;
  }

  switch(true) {
    case isMongoConnected && !isRedisConnected: {
      disconnectMongoDb();
      return false;
    }
    case !isMongoConnected && isRedisConnected: {
      disconnectRedis();
      return false;
    }
    case !isMongoConnected && !isRedisConnected: {
      return false;
    }
    case isMongoConnected && isRedisConnected: {
      return true;
    }
    default: {
      return false;
    }
  }
}

module.exports = {
  sendResponse,
  encrypt,
  decrypt,
  getParsedData,
  checkDBConnections
}