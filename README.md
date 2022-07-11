# TimerVTT

A simple timer (uses real world time) module that works for all the players in Foundry VTT.

## Usage

The timer icon can be found by Game Masters in the _Basic Controls_. It will open a window with a few options for the timer.

![Timer window][1]

### Options

- **Type** - Select if you want a timer or a stopwatch;
- **Description** - Optionally you can provide a text description of the timer;
- **Enable ticks** - A ticking sound will play if enabled;
- **Enable end sound** - An alarm clock will sound, if enabled, when the timer expires;
- **Private timer** - If checked the timer will only be visible to you.
- **Ignore game pause** - If checked the timer will not pause with the game, and will remain to count.
- **End message** - Sends the content in a chat message when the timer expires. If no content is provided no message will be sent. Can be used to run macros if used with [The Furnace (Advanced Macros)](https://foundryvtt.com/packages/furnace)

Once the timer is started a new message will appear in the _Chat Log_: ![Timer start][2].

If the game is unpaused the timer will start to countdown: ![Timer counting down][3].

As soon as the timer has expired a notification will appear and the message will indicate that the timer has expired: ![Timer expired][4].

After a few seconds(15) the message will disappear from the _Chat Log_. If you wish to cancel the timer just delete the respective message.

## Creating timers programmatically

A timer can be created through macros using:

```Javascript
//Set durationInSeconds to the desired duration
Timer.createTimer(durationInSeconds);

//A Stopwatch can also be created:
Timer.createStopwatch();
```

You can call these functions with more parameters for the diferent options, these parameters are as follows:

```javascript
Timer.createTimer(
  durationInSeconds,
  description,
  tickSound,
  endSound,
  privateTimer,
  endMessage,
  ignorePause
);

Timer.createStopwatch(description, tickSound, privateTimer, ignorePause);
```

| Name                  | Type                | Description                                                                                                                                                                                                                     |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **durationInSeconds** | [Integer]           | Duration of the timer in seconds                                                                                                                                                                                                |
| **description**       | [String]            | defaults to empty string ("") which is the same as no description                                                                                                                                                               |
| **tickSound**         | [Boolean]/[Integer] | Plays tick sound on the last 10 seconds if set to _true_; Doesn't play if set to _false_; Plays sound in the last _tickSound_ [Integer] seconds if type is an Integer (defaults to _true_ if timer, _false_ if it is stopwatch) |
| **endSound**          | [Boolean]           | Plays sound on timer expire (defaults to _true_)                                                                                                                                                                                |
| **privateTimer**      | [Boolean]/[String]  | Defines if the timer is not visible to other players (defaults to _false_). If set to "sound" only the sound will be broadcasted to the players                                                                                 |
| **endMessage**        | [String]            | Adds a message to the chat on timer expire. Defaults to empty string ("") which is the same as no message. Can be used to run macros if used with [The Furnace (Advanced Macros)](https://foundryvtt.com/packages/furnace)      |
| **ignorePause**       | [Boolean]           | Defines if the timer should pause with the game (defaults to _false_)                                                                                                                                                           |

### Examples

```Javascript
//Creates a 30 seconds private timer without sounds and no description
Timer.createTimer(30, "", false, false, true);

//Creates a 10 seconds timer with the description 'Hurry Up!'
//Note: Plays sounds and isn't private
Timer.createTimer(10, "Hurry Up!");

//Creates a 15 second timer that runs a macro on expire (requires The Furnace)
Timer.createTimer(15, "", true, true, false, '/"Macro Name"');

//Creates a 1 minute timer with ticks in the last 30 seconds
Timer.createTimer(60, "", 30)

//Create a private stopwatch with description 'Too long?'
Timer.createStopwatch("Too long?", false, true);
```

[1]: https://joaomeneses.pt/timerVTT/1.png
[2]: https://joaomeneses.pt/timerVTT/2.png
[3]: https://joaomeneses.pt/timerVTT/3.png
[4]: https://joaomeneses.pt/timerVTT/4.png
