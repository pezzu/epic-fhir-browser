const epic = require("./service");

const search = async (resource, params) => {
  const response = await epic.get(`api/FHIR/R4/${resource}`, params);
  return (response.total > 0) ? response.entry.map((e) => e.resource) : [];
}

const searchOne = async (resource, params) => {
  const results = await search(resource, params);
  return results[0]
}

module.exports = { R4: { search, searchOne } };
