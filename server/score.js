var express = require("express");
var { appendJSONToFile, readJSONArray, clearFile } = require("./helpers/file");

var scoreRouter = express.Router();

const express = require("express");
const {
  appendJSONToFile,
  readJSONArray,
  clearFile
} = require("./helpers/file");

const hiScoresFilePath = "./scores.json";

const scoreRouter = express.Router();

//todo (@nik): add your buffer implementation here
//to keep only top 10 results for hi-scores
//sort by score
//keep only 1 user with unique name

function scoreNormalize(scoreArr, scoreItem) {
  if (scoreArr.length == 0) {
    scoreArr.unshift(scoreItem);
    return scoreArr;
  }
  if (!scoreArr) return (scoreArr = [].unshift(scoreItem));
  let normalizedScore = scoreArr;

  let isNameExist = false;
  normalizedScore.forEach(item => {
    if (item.name === scoreItem.name) isNameExist = true;
    if (item.name === scoreItem.name && item.score < scoreItem.score) {
      item.score = scoreItem.score;
    }
  });

  if (!isNameExist) {
    normalizedScore.unshift(scoreItem);
    isNameExist = false;
  }

  normalizedScore.sort((a, b) => {
    return a.score - b.score;
  });
  normalizedScore.splice(10);
  return normalizedScore;
}

var hiScores = readJSONArray(hiScoresFilePath);

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

  hiScores = scoreNormalize(hiScores, user);

  //   broadcast(JSON.stringify(user));

  res.json(hiScores);
});

function saveHiScores() {
  clearFile(hiScoresFilePath);
  hiScores.forEach(score => appendJSONToFile(hiScoresFilePath, score));
  console.log(`💾  hiScores saved to ${hiScoresFilePath}`);
}

module.exports = { scoreRouter, saveHiScores };
