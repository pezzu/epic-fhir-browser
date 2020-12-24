const httpStatus = require("http-status");
const { R4 } = require("../services/epic-fhir");

async function details(req, res, next) {
  try {
    const patient = await R4.searchOne("Patient", req.query);

    const [medication, condition] = await Promise.all([
      R4.search("MedicationRequest", { patient: patient.id }),
      R4.search("Condition", { patient: patient.id, category: "problem-list-item" }),
    ])

    res.json({patient, medication, condition});
  } catch (err) {
    err.status = httpStatus.INTERNAL_SERVER_ERROR;
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const result = await R4.search("Patient", req.query);
    res.json(result);
  } catch (err) {
    err.status = httpStatus.INTERNAL_SERVER_ERROR;
    next(err);
  }
}

module.exports = { search, details };
