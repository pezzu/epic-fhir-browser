const httpStatus = require("http-status");
const { R4 } = require("../services/epic-fhir");
const { JSDOM } = require("jsdom");

const decode = (str) => Buffer.from(str, "base64").toString();

const expandBase64 = (html) => {
  const dom = new JSDOM(html);
  const base64re = /base64;(\S+)/;
  const text = dom.window.document.documentElement.textContent;
  const base64 = text.match(base64re);
  if (base64) {
    dom.window.document.documentElement.textContent = decode(base64[1]);
    return dom.serialize();
  } else {
    return html;
  }
};

const expandAttachments = async (content) => {
  return Promise.all(
    content.map((item) =>
      R4.readOne(item.attachment.url).then((attachment) => ({
        ...item,
        attachment: expandBase64(attachment),
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
      }).then((documents) => expandContents(documents)),
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
