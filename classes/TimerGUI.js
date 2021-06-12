import { createTimer, createStopwatch } from '../scripts/timer.js';

export class TimerGUI extends FormApplication {
  constructor() {
    super();
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['form'],
      popOut: true,
      template: `./modules/timer/templates/timerGUI.html`,
      id: 'module-timer-application',
      title: 'Timer',
    });
  }

  getData() {
    //Todo: Get data stored from prev use
    return {
      duration: 30,
      tick: true, //Fix: Not in use
      end: true,
      private: false
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _updateObject(_, formData) {
    if (formData.timerDuration <= 0)
      return ui.notifications.warn("Please insert a duration greater than 0 seconds!");
    const { timerType, timerDuration, timerDescription, timerTick, timerEnd, timerPrivate, timerExpireMessage } = formData;
    let parsedTimerTick = true;
    if (typeof timerTick == 'number') {
      parsedTimerTick = parseInt(timerTick);
    } else if (timerTick === "false") {
      parsedTimerTick = false;
    }
    //Todo: Store options for next use
    if (timerType == "Down")
      createTimer(timerDuration, timerDescription, parsedTimerTick, timerEnd, timerPrivate, timerExpireMessage);
    else
      createStopwatch(timerDescription, timerPrivate, timerTick === "true");
  }

  static addButton() {
    Hooks.on("getSceneControlButtons", (data) => {
      data[0].tools.push({
        name: "module-timer",
        title: "Timer",
        icon: "fas fa-clock",
        button: true,
        onClick: () => new TimerGUI().render(true),
        visible: game.user.isGM
      })
    });
  }
}
