# TimerVTT

A simple timer (uses real world time) module that works for all the players in Foundry VTT.

## Usage

The timer icon can be found by Game Masters in the _Basic Controls_. It will open a window with a few options for the timer.

![Timer window][1]

### Options

- **Description** - Optionally you can provide a text description of the timer;
- **Enable 10s ticks** - A ticking sound will start playing in the last 10 seconds if enabled;
- **Enable end sound** - An alarm clock will sound, if enabled, when the timer expires;
- **Private timer** - If checked the timer will only be visible to you.

Once the timer is started a new message will appear in the _Chat Log_: ![Timer start][2].

If the game is unpaused the timer will start to countdown: ![Timer counting down][3].

As soon as the timer has expired a notification will appear and the message will indicate that the timer has expired: ![Timer expired][4].

After a few seconds the message will disappear from the _Chat Log_. If you wish to cancel the timer just delete the respective message.

[1]: https://joaomeneses.pt/timerVTT/1.png
[2]: https://joaomeneses.pt/timerVTT/2.png
[3]: https://joaomeneses.pt/timerVTT/3.png
[4]: https://joaomeneses.pt/timerVTT/4.png
