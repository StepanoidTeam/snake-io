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
  console.log(`Snake.io listening on http://localhost:${port}`);
});

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: wsPort });
console.log(`websocket listening on port ${wsPort}`);

function closeHttpServer() {
  console.log("⏳  closing http server...");
  return new Promise(resolve => {
    console.log("🛑  http server closed.");
    server.close(() => resolve());
  });
}

function closeWsServer() {
  console.log("⏳  closing websocket server...");
  return new Promise(resolve => {
    console.log("🛑  websocket server closed.");
    wss.close(() => resolve());
  });
}

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

async function stopServer() {
  saveHiScores();

  await Promise.all([closeHttpServer(), closeWsServer()]);

  process.exit(0);
}

process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);
