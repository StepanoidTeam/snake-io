var express = require("express");
var app = express();
var { scoreRouter, saveHiScores } = require("./server/score");
const { stopWsServer } = require("./server/ws-server");

app.use(express.json());
app.use(express.static("client"));
app.use("/score", scoreRouter);

//todo: add & handle websocket connections (use ws lib?)

const port = 3000; //todo: get from config?
const server = app.listen(port, function() {
  console.log(`🌐  http server started, on http://localhost:${port}`);
});

function stopHttpServer() {
  console.log("⏳  stopping http server...");
  return new Promise(resolve => {
    console.log("🛑  http server stopped.");
    server.close(() => resolve());
  });
}

async function stopServer() {
  saveHiScores();

  await Promise.all([stopHttpServer(), stopWsServer()]);

  process.exit(0);
}

process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);
