const httpStatus = require("http-status");
const epic = require("../helpers/Epic");

async function details(req, res, next) {
  try {
    const patient = await epic.get(`api/FHIR/R4/Patient/${req.params.id}`);
    res.json(patient);
  } catch (err) {
    err.status = httpStatus.INTERNAL_SERVER_ERROR;
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const result = await epic.get("api/FHIR/R4/Patient", req.query);

    if (result.total > 0) {
      res.json(result.entry.map((e) => e.resource));
    } else {
      res.json([]);
    }
  } catch (err) {
    err.status = httpStatus.INTERNAL_SERVER_ERROR;
    next(err);
  }
}

module.exports = { search, details };
