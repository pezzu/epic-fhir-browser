const { search, details } = require("../controllers/patient");

module.exports = (router) => {

  router.get("/", search);
  router.get("/details", details);

  return router;
};
