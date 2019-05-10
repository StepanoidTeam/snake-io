import { reducer } from "./state.js";

//todo: get port from config?
const ws = new WebSocket("ws://127.0.0.1:8080/");

ws.addEventListener("open", event => console.log("ws connected", event));
ws.addEventListener("message", ({ data }) => reducer(JSON.parse(data)));
