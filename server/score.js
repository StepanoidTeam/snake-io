var express = require("express");
var scoreRouter = express.Router();
var { appendJSONToFile, readJSONArray, clearFile } = require("./helpers/file");

//todo (@nik): add your buffer implementation here
//to keep only top 10 results for hi-scores
//sort by score
//keep only 1 user with unique name
var hiScores = readJSONArray("./scores.json");

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });
// define the home page route
scoreRouter.get("/", function(req, res) {
  res.json(hiScores);
});
// define the about route
scoreRouter.post("/", function(req, res) {
  console.log(req.body);
  //todo: check validity of user
  //do not push random shit
  let user = req.body;

  hiScores.splice(10);
  hiScores.unshift(user);

  //   broadcast(JSON.stringify(user));

  res.json(hiScores);
});

function saveHiScores() {
  clearFile("./scores.json");
  hiScores.forEach(score => appendJSONToFile("./scores.json", score));
}

module.exports = { scoreRouter, saveHiScores };
