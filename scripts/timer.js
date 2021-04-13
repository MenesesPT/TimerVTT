import { sendMessage, MESSAGES } from './socket.js'

export function updateTimer(id, expire, description) {
  let msg = ui?.chat?.collection?.get(id);
  if (msg == null)
    return;
  msg.data.content = timerText(expire, description);
  if (expire <= 0) {
    timerExpiredNotification(description);
  }
  ui.chat.updateMessage(msg, expire <= 0);
}

export async function createTimer(duration, description, tickSound, endSound, personal) {
  let messageData = { content: timerText(duration, description) };
  if (personal) {
    messageData.whisper = [game.user._id];
  }
  let msg = await ChatMessage.create(messageData);
  msg.timer = duration;
  msg.description = description;
  let interval = setInterval(() => {
    //Message no longer exists
    if (ui?.chat?.collection?.get(msg.id) == null) {
      clearInterval(interval);
      return;
    }
    //Send updates for players that might join the session while game is paused
    if (game.paused) {
      if (!personal) sendMessage(MESSAGES.UPDATE_TIMER, { id: msg.id, expire: msg.timer, description: msg.description });
      return;
    }
    msg.timer--;
    msg.data.content = timerText(msg.timer, msg.description);

    if (tickSound && msg.timer <= 10 && msg.timer > 0) {
      AudioHelper.play({
        src: "./modules/timer/audio/tick" + ((msg.timer + 1) % 2 + 1) + ".wav",
        volume: 1.0, autoplay: true, loop: false
      }, !personal);
    }

    if (msg.timer <= 0) {
      clearInterval(interval);
      if (endSound)
        AudioHelper.play({ src: "./modules/timer/audio/end.wav", volume: 0.7, autoplay: true, loop: false }, !personal);
      timerExpiredNotification(msg.description);
      setTimeout(() => { if (ui?.chat?.collection?.get(msg.id) != null) msg.delete() }, 15000);
    }
    if (!personal) sendMessage(MESSAGES.UPDATE_TIMER, { id: msg.id, expire: msg.timer, description: msg.description });
    ui.chat.updateMessage(msg, msg.timer <= 0);
  }, 1000);
}

function timerExpiredNotification(description) {
  let text = "The timer <i>" + description + "</i>";
  if (description.length > 0)
    text += ' ';
  text += 'has expired!'
  ui.notifications.info(text);
}

function timerText(timer, description = "") {
  let text = '<p>' + description + '</p>';
  if (text.length < 8) {
    text = "";
  }
  if (timer > 0) {
    text += 'Timer: <b ' + (timer < 6 ? 'style="color: red"' : (timer < 11 ? 'style="color: orange"' : '')) + '>' + new Date(timer * 1000).toISOString().substr(14, 5) + "</b>";
  } else {
    text += `<b style="color:red">Time's Up!</b>`;
  }
  return text;
}