require("dotenv").config();

const options = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  epic_url: process.env.EPIC_URL,
  client_id: process.env.CLIENT_ID,
  private_key: process.env.PRIVATE_KEY,
};

module.exports = options;
