import { state } from "./state.js";

//todo: get port from config?
const ws = new WebSocket("ws://127.0.0.1:8080/");

ws.addEventListener("open", wsMessageReducer);
ws.addEventListener("message", wsMessageReducer);

//test ping
//setInterval(() => ws.send("dawa lowadka??"), 2000);
