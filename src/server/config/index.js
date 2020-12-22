require("dotenv").config();

const options = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
};

module.exports = options;
