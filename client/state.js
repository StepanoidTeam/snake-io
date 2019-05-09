const state = {
  online: 0
};

function reducer(event) {
  switch (event.type) {
    case "ONLINE": {
      state.online = event.payload;
      break;
    }
    default: {
      console.log("⚠", event);
    }
  }
}

export { state };
