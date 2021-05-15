import { initNetwork, MESSAGES, onMessageReceived } from './socket.js';
import { TimerGUI } from '../classes/TimerGUI.js';
import { updateTimer, createTimer, createStopwatch } from './timer.js';

Hooks.on("init", async () => {

  initNetwork();

  onMessageReceived(MESSAGES.UPDATE_TIMER, ({ id, expire, description }) => {
    updateTimer(id, expire, description);
  });

  TimerGUI.addButton();
  window.moduleTimerApplication = TimerGUI;
});


Hooks.on("setup", async () => {
  //preload sound
  AudioHelper.play({ src: "./modules/timer/audio/end.wav", autoplay: false }, true);
});

export function TimerFunctions() {
  return {
    createTimer,
    createStopwatch
  };
}

Hooks.on("ready", async () => {
  window.Timer = TimerFunctions();
})