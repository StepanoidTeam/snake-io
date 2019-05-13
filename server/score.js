const express = require("express");

const scoreRouter = express.Router();

const { writeJSONArray, readJSONArray, clearFile } = require("./helpers/file");

const hiScoresFilePath = "./scores.json";

//to keep only top 10 results for hi-scores
//sort by score
//keep only 1 user with unique name

const TOP_SCORE_LENGTH = 10;

function updateScore(scoreArr, scoreItem = {}) {
  if (!scoreArr) return [scoreItem];

  let playerNameIndex = scoreArr.findIndex(item => {
    return item.name == scoreItem.name;
  });
  let playerScorePosIndex = scoreArr.findIndex(item => {
    return scoreItem.score >= item.score;
  });
  let currentUser = scoreArr[playerNameIndex];
  let isTopScore = playerScorePosIndex != -1;

  if (currentUser && isTopScore) {
    if (currentUser.score >= scoreItem.score) return scoreArr;
    scoreArr.splice(playerNameIndex, 1);
    scoreArr.splice(playerScorePosIndex, 0, scoreItem);
    return scoreArr;
  }

  if (isTopScore) {
    scoreArr.splice(playerScorePosIndex, 0, scoreItem);
    scoreArr.splice(TOP_SCORE_LENGTH, 1);
    return scoreArr;
  }

  scoreArr.push(scoreItem);
  scoreArr.splice(TOP_SCORE_LENGTH);
  return scoreArr;
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

  hiScores = updateScore(hiScores, user);

  //   broadcast(JSON.stringify(user));

  res.json(hiScores);
});

function saveHiScores() {
  writeJSONArray(hiScoresFilePath, hiScores, true);

  console.log(`💾  hiScores saved to ${hiScoresFilePath}`);
}

module.exports = { scoreRouter, saveHiScores, updateScore };
