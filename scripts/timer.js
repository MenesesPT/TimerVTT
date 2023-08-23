import { sendMessage, MESSAGES } from './socket.js'

export function updateTimer(id, expire, description, isStopwatch) {
  let msg = ui?.chat?.collection?.get(id);
  if (msg == null)
    return;
  if (isStopwatch) {
    msg.content = stopwatchText(expire, description);
  } else {
    msg.content = timerText(expire, description);
    if (expire <= 0) {
      timerExpiredNotification(description);
    }
  }
  ui.chat.updateMessage(msg, expire <= 0);
}

export async function createStopwatch(description = "", tickSound = false, personal = false, ignorePause = false) {
  let messageData = { content: stopwatchText(0, description) };
  if (personal === 'true') personal = true;
  else if (personal === 'false') personal = false;
  if (personal != false) {
    messageData.whisper = [game.user._id];
  }
  let msg = await ChatMessage.create(messageData);
  msg.content = stopwatchText(0, description, msg.id);
  msg.timer = 0;
  msg.description = description;
  setTimeout(() => ui.chat.updateMessage(msg, false), 50);

  let interval = setInterval(() => {
    //Message no longer exists
    if (ui?.chat?.collection?.get(msg.id) == null) {
      clearInterval(interval);
      return;
    }
    //Send updates for players that might join the session while game is paused
    if (!ignorePause && game.paused) {
      if (personal == false) sendMessage(MESSAGES.UPDATE_TIMER, { id: msg.id, expire: msg.timer, description: msg.description, stopwatch: true });
      return;
    }
    msg.timer++;
    msg.content = stopwatchText(msg.timer, msg.description, msg.id);

    if (tickSound === true) {
      AudioHelper.play({
        src: "./modules/timer/audio/tick" + ((msg.timer + 1) % 2 + 1) + ".wav",
        volume: 1.0, autoplay: true, loop: false
      }, personal == false || personal == 'sound');
    }

    if (personal == false) sendMessage(MESSAGES.UPDATE_TIMER, { id: msg.id, expire: msg.timer, description: msg.description, stopwatch: true });
    ui.chat.updateMessage(msg, false);
  }, 1000);
  if (game.user.isGM || game.user.isTrusted) {
    $(document).on('click', '.timer_stop' + msg.id, () => {
      clearInterval(interval);
      const parts = msg.content.split('<button style="font-size: 12px;height: 24px;line-height: 20px;margin: 2px 0;background: rgba(0, 0, 0, 0.1);  border: 2px groove #eeede0;" class="timer_stop' + msg.id + '">Stop</button>');
      msg.content = parts[0] + parts[1];
      ui.chat.updateMessage(msg, false);
    });
    $(document).on('click', '.timer_delete' + msg.id, () => {
      clearInterval(interval);
      setTimeout(() => msg.delete(), 100);
    });
  }
}

export async function createTimer(duration, description = "", tickSound = true, endSound = true, personal = false, timerExpireMessage = "", ignorePause = false) {
  if (duration == null) {
    ui.notifications.error("Duration needs to be set!");
    return;
  }
  let messageData = { content: timerText(duration, description) };
  if (personal === 'true') personal = true;
  else if (personal === 'false') personal = false;
  if (personal != false) {
    messageData.whisper = [game.user._id];
  }
  let msg = await ChatMessage.create(messageData);
  msg.content = timerText(duration, description, msg.id);
  msg.timer = duration;
  msg.description = description;
  setTimeout(() => ui.chat.updateMessage(msg, false), 50);
  let interval = setInterval(async () => {
    //Message no longer exists
    if (ui?.chat?.collection?.get(msg.id) == null) {
      clearInterval(interval);
      return;
    }
    //Send updates for players that might join the session while game is paused
    if (!ignorePause && game.paused) {
      if (personal == false) sendMessage(MESSAGES.UPDATE_TIMER, { id: msg.id, expire: msg.timer, description: msg.description, stopwatch: false });
      return;
    }
    msg.timer--;
    msg.content = timerText(msg.timer, msg.description, msg.id);

    if (tickSound === true || Number.isInteger(tickSound) && msg.timer <= tickSound && msg.timer > 0) {
      AudioHelper.play({
        src: "./modules/timer/audio/tick" + ((msg.timer + 1) % 2 + 1) + ".wav",
        volume: 1.0, autoplay: true, loop: false
      }, personal == false || personal == 'sound');
    }

    if (msg.timer <= 0) {
      clearInterval(interval);
      if (endSound)
        AudioHelper.play({ src: "./modules/timer/audio/end.wav", volume: 0.7, autoplay: true, loop: false }, personal == false || personal == 'sound');
      timerExpiredNotification(msg.description);
      if (timerExpireMessage.length) {
        let expireMessage = { content: timerExpireMessage };
        if (personal == true) {
          expireMessage.whisper = [game.user._id];
        }
        await ChatMessage.create(expireMessage);
      }
      setTimeout(() => { if (ui?.chat?.collection?.get(msg.id) != null) msg.delete() }, 15000);
    }
    if (personal == false) sendMessage(MESSAGES.UPDATE_TIMER, { id: msg.id, expire: msg.timer, description: msg.description, stopwatch: false });
    ui.chat.updateMessage(msg, msg.timer <= 0);
  }, 1000);
  if (game.user.isGM || game.user.isTrusted) {
    $(document).on('click', '.timer_stop' + msg.id, () => {
      clearInterval(interval);
      const parts = msg.content.split('<button style="font-size: 12px;height: 24px;line-height: 20px;margin: 2px 0;background: rgba(0, 0, 0, 0.1);  border: 2px groove #eeede0;" class="timer_stop' + msg.id + '">Stop</button>');
      msg.content = parts[0] + parts[1];
      ui.chat.updateMessage(msg, false);
    });
    $(document).on('click', '.timer_delete' + msg.id, () => {
      clearInterval(interval);
      setTimeout(() => msg.delete(), 100);
    });
  }
}

function timerExpiredNotification(description) {
  let text = "The timer <i>" + description + "</i>";
  if (description.length > 0)
    text += ' ';
  text += 'has expired!'
  ui.notifications.info(text);
}

function timerText(timer, description = "", id = '') {
  let text = '<div><p>' + description + '</p>';
  if (text.length < 8) {
    text = "";
  }
  if (timer > 0) {
    text += 'Timer: <b ' + (timer < 6 ? 'style="color: red"' : (timer < 11 ? 'style="color: orange"' : '')) + '>' + new Date(timer * 1000).toISOString().substr(14, 5) + "</b>";
  } else {
    text += `<b style="color:red">Time's Up!</b>`;
  }
  if (game.user.isGM || game.user.isTrusted) text += '<hr><button style="font-size: 12px;height: 24px;line-height: 20px;margin: 2px 0;background: rgba(0, 0, 0, 0.1);  border: 2px groove #eeede0;" class="timer_stop' + id + '">Stop</button><button style="font-size: 12px;height: 24px;line-height: 20px;margin: 2px 0;background: rgba(0, 0, 0, 0.1);  border: 2px groove #eeede0;" class="timer_delete' + id + '">Delete</button>';
  text += "</div>";
  return text;
}

function stopwatchText(timer, description = "", id = '') {
  let text = '<div><p>' + description + '</p>';
  if (text.length < 8) {
    text = "";
  }
  text += 'Timer: <b>' + new Date(timer * 1000).toISOString().substr(14, 5) + "</b>";
  if (game.user.isGM || game.user.isTrusted) text += '<hr><button style="font-size: 12px;height: 24px;line-height: 20px;margin: 2px 0;background: rgba(0, 0, 0, 0.1);  border: 2px groove #eeede0;" class="timer_stop' + id + '">Stop</button><button style="font-size: 12px;height: 24px;line-height: 20px;margin: 2px 0;background: rgba(0, 0, 0, 0.1);  border: 2px groove #eeede0;" class="timer_delete' + id + '">Delete</button>';
  text += "</div>";
  return text;
}
