const express = require("express");
const { writeJSONArray, readJSONArray } = require("./helpers/file");

const scoreRouter = express.Router();

//todo: move to config?
const hiScoresFilePath = "./scores.json";
const TOP_SCORE_LENGTH = 10;

function updateScore(scoreArr, scoreItem = {}) {
  if (!scoreArr) return [scoreItem];

  const playerNameIndex = scoreArr.findIndex(item => {
    return item.name == scoreItem.name;
  });
  const playerScorePosIndex = scoreArr.findIndex(item => {
    return scoreItem.score >= item.score;
  });
  const currentUser = scoreArr[playerNameIndex];
  const isTopScore = playerScorePosIndex != -1;

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

let hiScores = readJSONArray(hiScoresFilePath);

scoreRouter.get("/", function(req, res) {
  res.json(hiScores);
});

scoreRouter.post("/", function(req, res) {
  console.log(req.body);
  //todo: check validity of user
  //do not push random shit
  let user = req.body;

  hiScores = updateScore(hiScores, user);

  res.json(hiScores);
});

function saveHiScores() {
  writeJSONArray(hiScoresFilePath, hiScores, true);

  console.log(`💾  hiScores saved to ${hiScoresFilePath}`);
}

module.exports = { scoreRouter, saveHiScores, updateScore };
