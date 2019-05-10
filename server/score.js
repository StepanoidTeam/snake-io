const express = require("express");

const scoreRouter = express.Router();

const {
  appendJSONToFile,
  readJSONArray,
  clearFile
} = require("./helpers/file");

const hiScoresFilePath = "./scores.json";

//todo (@nik): add your buffer implementation here
//to keep only top 10 results for hi-scores
//sort by score
//keep only 1 user with unique name

function scoreNormalize(scoreArr, scoreItem) {
  let playerIndex = scoreArr.findIndex(item => {
    return item.name == scoreItem.name;
  });

  let playerScoreIndex = scoreArr.findIndex(item => {
    return scoreItem.score >= item.score;
  });

  playerScoreIndex =
    playerScoreIndex == -1 ? scoreArr.length - 1 : playerScoreIndex;

  if (playerIndex != -1) {
    scoreArr.splice(playerIndex, 1, scoreItem);
    return scoreArr;
  }

  scoreArr.splice(playerScoreIndex, 0, scoreItem);
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
