const jwt = require('jsonwebtoken');

module.exports = (userId) => {
  const expiresIn = '7d';

  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  const decoded = jwt.decode(token);

  return {
    token,
    expiresAt: decoded.exp * 1000
  };
};
