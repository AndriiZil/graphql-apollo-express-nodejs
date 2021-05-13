
const jwt = require('jsonwebtoken');

module.exports.verifyUser = (req) => {
  try {
    req.userId = null;
    const bearerHeader = req.headers.authorization;

    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.userId = payload.id;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

};
