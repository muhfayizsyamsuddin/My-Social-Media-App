const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "sportify123";

function signToken(payload) {
  return jwt.sign(payload, SECRET);
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };
