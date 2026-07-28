const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_mini_crm_2026_safe_hash', {
    expiresIn: '30d'
  });
};

module.exports = generateToken;
