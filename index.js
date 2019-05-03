var express = require("express");
var app = express();

var users = [];

app.use((req, res, next) => {
  // console.log(JSON.stringify(req));
  next();
});

app.use(express.json());
app.use(express.static("client"));

app.get("/getScore", function(req, res) {
  res.json(users);
});

app.post("/setScore", function(req, res) {
  console.log(req.body);
  let user = req.body;

  users.push(user);

  res.json(users);
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
  //
});
