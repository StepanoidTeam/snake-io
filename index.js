var express = require("express");
var app = express();
var { scoreRouter, saveHiScores } = require("./server/score");

//todo: log requested url/method/body
app.use((req, res, next) => {
  // console.log(JSON.stringify(req));
  next();
});

app.use(express.json());
app.use(express.static("client"));
app.use("/score", scoreRouter);

//todo: add & handle websocket connections (use ws lib?)

const port = 3000; //todo: get from config?
const wsPort = 8080;
const server = app.listen(port, function() {
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

//add sigterm event
process.on("SIGINT", () => {
  console.info("SIGINT signal received.");
  saveHiScores();
  console.log("Closing http server.");
  server.close(() => {
    console.log("Http server closed.");

    wss.close(() => {
      console.log("WS Server Stopped.");
      process.exit(0);
    });
  });
});
