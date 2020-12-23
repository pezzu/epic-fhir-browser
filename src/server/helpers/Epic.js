const cuid = require("cuid");
const jwt = require("jsonwebtoken");
const url = require("url");
const axios = require("axios");

const config = require("../config");

const EPIC_URL = config.epic_url;
const AUTH_URL = `${config.epic_url}/oauth2/token`;

const connect = async () => {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS384",
    typ: "JWT",
  };

  const payload = {
    iss: config.client_id,
    sub: config.client_id,
    aud: AUTH_URL,
    jti: cuid(),
    exp: now + 4 * 60,
  };

  const token = jwt.sign(payload, config.private_key, { header });

  const params = new url.URLSearchParams({
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: token,
  });

  return axios.post(AUTH_URL, params.toString()).then(({ data }) => data);
};

const Epic = {
  auth: {
    token: "",
    expires: 0,
    expired() {
      return this.expires <= Math.floor(Date.now() / 1000);
    },
  },

  async connection() {
    return new Promise((resolve, reject) => {
      if (!this.auth.token || this.auth.expired()) {
        connect()
          .then(({ access_token, expires_in }) => {
            this.auth.token = access_token;
            this.auth.expires = Math.floor(Date.now() / 1000) + expires_in;
            resolve(this.auth.token);
          })
          .catch((err) => reject(err));
      } else {
        resolve(this.auth.token);
      }
    });
  },

  async get(url, params) {
    return this.connection()
      .then((token) =>
        axios.get(`${EPIC_URL}/${url}`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
      .then(({ data }) => data);
  },
};

module.exports = Epic;
