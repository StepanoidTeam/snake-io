const state = {
  online: 0,
  apples: 0
};

const listeners = [];

//todo: make unsubscibe method
function onStateChange(callback) {
  listeners.push(callback);
}

function reducer(event) {
  switch (event.type) {
    case "ONLINE": {
      state.online = event.payload;
      break;
    }
    case "APPLES": {
      state.apples = event.payload;
      break;
    }
    default: {
      console.log("⚠️", event);
    }
  }

  listeners.forEach(listener => listener(state));
}

function getState() {
  return state;
}

export { getState, reducer, onStateChange };
