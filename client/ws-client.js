const ws = new WebSocket("ws://127.0.0.1:8080/");

ws.addEventListener("open", msg => console.log("open", msg));
ws.addEventListener("message", msg => console.log(msg));

//test ping
//setInterval(() => ws.send("dawa lowadka??"), 2000);
