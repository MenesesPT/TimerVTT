import { initNetwork, MESSAGES, onMessageReceived } from './socket.js';
import { TimerGUI } from '../classes/TimerGUI.js';
import { updateTimer } from './timer.js';

Hooks.on("init", function () {
  console.log("Loading Timer module...");
  initNetwork();

  onMessageReceived(MESSAGES.UPDATE_TIMER, ({ id, expire, description }) => {
    updateTimer(id, expire, description);
  });

  TimerGUI.addButton();
  window.moduleTimerApplication = TimerGUI;
});


Hooks.on("setup", function () {
  //preload sound
  AudioHelper.play({ src: "./modules/timer/audio/end.wav", autoplay: false }, true);
});