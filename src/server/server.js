const express = require("express");
const path = require("path");

const config = require("./config");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = express.Router();
app.use("/api/v1/patient", require("./routes/patient")(router));

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.resolve(__dirname, "../../build")));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../build", "index.html"));
  });
}

const port = config.port || 8090;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
