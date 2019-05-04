var express = require("express");
var app = express();

//todo (@nik): add your buffer implementation here
//to keep only top 10 results for hi-scores
//sort by score
//keep only 1 user with unique name
var users = [];

//todo: log requested url/method/body
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
  //todo: check validity of user
  //do not push random shit
  let user = req.body;

  users.splice(10);
  users.unshift(user);

  broadcast(JSON.stringify(user));

  res.json(users);
});

//todo: add & handle websocket connections (use ws lib?)

const port = 3000; //todo: get from config?
const wsPort = 8080;
app.listen(port, function() {
  //todo: add url to open site in browser from console
  console.log(`Snake.io listening on port ${port}!`);
});

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: wsPort });
console.log(`websocket listening on port ${wsPort}`);

function broadcast(msg) {
  if (wss && wss.clients)
    [...wss.clients]
      .filter(client => client.readyState === WebSocket.OPEN)
      .forEach(client => {
        client.send(msg);
      });
}

wss.on("connection", function connection(ws) {
  console.log("connected");
  broadcast("@b:" + "connected someone else");
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    ws.send("yes it is111");
    broadcast("@b:" + message);
  });

  ws.send("something");
});
