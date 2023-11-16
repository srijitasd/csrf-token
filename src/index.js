const express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var csrf = require("csurf");

const App = express();

App.use(bodyParser.urlencoded({ extended: false }));
App.use(cookieParser());
App.set("view engine", "hbs");
App.use(csrf({ cookie: true }));

App.use(function (err, req, res, next) {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  res.status(403);
  res.send("csrf token invalid");
});

App.get("/", (req, res) => {
  res.render("form", { token: req.csrfToken() });
});

App.post("/submit", (req, res) => {
  console.log(req.headers["x-csrf-token"], req.body._csrf);
  try {
    res.send("Data submittted successfully");
  } catch (error) {
    console.log(error.code);
  }
});

const PORT = process.env.PORT || 3000;

App.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
