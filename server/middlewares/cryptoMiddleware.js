const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const password = 'NWTJhDwdm2tU8DUKf9iPoEkGS2vbI0MqALDdMnWpE';
const key = crypto.scryptSync(password, 'salt', 32);
const iv = Buffer.alloc(16, 0);

const encryptoData = (userId) => {
  const data = userId + "!" + Date.now();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;    
}

const encryptoRemember = (remember) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(remember), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;    
}

const decryptoData = (param) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(param, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;    
}

module.exports = { encryptoData, decryptoData, encryptoRemember };
