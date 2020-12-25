module.exports = {
  apps : [{
    name: "epic",
    script: 'src/server/server.js',
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
  }],
};
