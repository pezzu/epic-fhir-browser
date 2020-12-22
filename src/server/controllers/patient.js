function details(req, res, next) {
  console.log(`Details for ${req.params.id}`);
}

function search(req, res, next) {
  console.log(`Search for ${req.query}`);
}

module.exports = { search, details };
