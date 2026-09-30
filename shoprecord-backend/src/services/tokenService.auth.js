const { generateToken, verifyToken } = require('../config/jwt.config');

class TokenService {
  // Create token for user
  createToken(userId) {
    return generateToken(userId);
  }

  // Verify token
  verifyToken(token) {
    try {
      return verifyToken(token);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Extract token from authorization header
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  // Decode token without verification (for expired token info)
  decodeToken(token) {
    const jwt = require('jsonwebtoken');
    return jwt.decode(token);
  }
}

module.exports = new TokenService();
