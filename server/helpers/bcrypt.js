const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
