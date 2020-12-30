const httpStatus = require("http-status");
const { R4 } = require("../services/epic-fhir");

const expandAttachments = async (content) => {
  return Promise.all(
    content.map((item) =>
      R4.readOne(item.attachment.url).then((attachment) => ({
        ...item,
        attachment,
      }))
    )
  );
};

const expandContents = async (documents) => {
  return Promise.all(
    documents.map((document) =>
      expandAttachments(document.content).then((attachments) => ({
        ...document,
        content: attachments,
      }))
    )
  );
};

async function details(req, res, next) {
  try {
    const patient = await R4.searchOne("Patient", req.query);

    const [medications, conditions, notes] = await Promise.all([
      R4.search("MedicationRequest", { patient: patient.id }),
      R4.search("Condition", {
        patient: patient.id,
        category: "problem-list-item",
      }),
      R4.search("DocumentReference", {
        patient: patient.id,
        category: "clinical-note",
      }).then(documents => expandContents(documents)),
    ]);

    res.json({ patient, medications, conditions, notes });
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
