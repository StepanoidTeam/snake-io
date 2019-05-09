const WebSocket = require("ws");
//todo: move to config
const wsPort = 8080;

//start ws server
const wss = new WebSocket.Server({ port: wsPort }, () => {
  console.log(`🌐  websocket server started, on port ${wsPort}`);
});

function broadcast(data) {
  const json = JSON.stringify(data);
  if (wss && wss.clients)
    [...wss.clients]
      .filter(client => client.readyState === WebSocket.OPEN)
      .forEach(client => {
        client.send(json);
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

function stopWsServer() {
  console.log("⏳  stopping websocket server...");
  return new Promise(resolve => {
    console.log("🛑  websocket server stopped.");
    wss.close(() => resolve());
  });
}

setInterval(() => {
  broadcast({ type: "ONLINE", payload: wss.clients.size });
}, 1000);

module.exports = { stopWsServer };
