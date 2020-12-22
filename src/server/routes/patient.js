const { search, details } = require("../controllers/patient");

module.exports = (router) => {

  router.get("/", search);
  router.get("/:id", details);

  return router;
};
