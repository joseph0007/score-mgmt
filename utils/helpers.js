const crypto = require("node:crypto");
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

module.exports = {
  sendResponse,
  encrypt,
  decrypt
}