const { verifyToken } = require('../utils/jwt');
const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No auth token' });
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
module.exports = { requireAuth };
