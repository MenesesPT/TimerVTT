/*
Based on the implementation of the Pings module (https://gitlab.com/foundry-azzurite/pings/)
*/

const SOCKET_NAME = 'module.timer';

const callbacks = {};

function messageCallbacks(message) {
  const prop = `_funcs${message}`;
  if (!callbacks[prop]) {
    callbacks[prop] = [];
  }
  return callbacks[prop];
}

function runMessageCallbacks(message, timerData) {
  messageCallbacks(message).forEach(func => func(timerData));
}

export function initNetwork() {
  game.socket.on(SOCKET_NAME, (data) => {
    if (data.message == MESSAGES.UPDATE_TIMER.name) {
      runMessageCallbacks(data.message, data.timerData);
    }
  });
}

export function onMessageReceived(message, callback) {
  messageCallbacks(message.name).push(callback);
}

function emit(...args) {
  game.socket.emit(SOCKET_NAME, ...args)
}


export function sendMessage(message, timerData) {
  message.dataProperties.forEach(prop => {
    if (!timerData.hasOwnProperty(prop)) {
      throw new Error(`Missing data for message "${message.name}": ${prop}`);
    }
  });
  emit({
    message: message.name,
    timerData
  });
}

export const MESSAGES = {
  UPDATE_TIMER: {
    name: 'UpdateTimer',
    dataProperties: [
      'id',
      'expire',
      'description'
    ]
  }
};