var express = require("express");
var scoreRouter = express.Router();

//todo (@nik): add your buffer implementation here
//to keep only top 10 results for hi-scores
//sort by score
//keep only 1 user with unique name
var users = [];

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });
// define the home page route
scoreRouter.get("/", function(req, res) {
  res.json(users);
});
// define the about route
scoreRouter.post("/", function(req, res) {
  console.log(req.body);
  //todo: check validity of user
  //do not push random shit
  let user = req.body;

  users.splice(10);
  users.unshift(user);

  //   broadcast(JSON.stringify(user));

  res.json(users);
});

module.exports = { scoreRouter };
