const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';
const signToken = (payload, expiresIn='7d') => jwt.sign(payload, SECRET, { expiresIn });
const verifyToken = (token) => jwt.verify(token, SECRET);
module.exports = { signToken, verifyToken };
