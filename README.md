# TimerVTT

A simple timer (uses real world time) module that works for all the players in Foundry VTT.

## Usage

The timer icon can be found by Game Masters in the _Basic Controls_. It will open a window with a few options for the timer.

![Timer window][1]

### Options

- **Type** - Select if you want a timer or a stopwatch;
- **Description** - Optionally you can provide a text description of the timer;
- **Enable 10s ticks** - A ticking sound will start playing in the last 10 seconds if enabled;
- **Enable end sound** - An alarm clock will sound, if enabled, when the timer expires;
- **Private timer** - If checked the timer will only be visible to you.

Once the timer is started a new message will appear in the _Chat Log_: ![Timer start][2].

If the game is unpaused the timer will start to countdown: ![Timer counting down][3].

As soon as the timer has expired a notification will appear and the message will indicate that the timer has expired: ![Timer expired][4].

After a few seconds the message will disappear from the _Chat Log_. If you wish to cancel the timer just delete the respective message.

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
Timer.createTimer(durationInSeconds, description, tickSound, endSound, privateTimer);

Timer.createStopwatch(description, privateTimer);
```

- **durationInSeconds** [Integer] is mandatory;
- **description** [String] defaults to empty string ("") which is the same as no description;
- **tickSound** [Boolean] defaults to _true_;
- **endSound** [Boolean] defaults to _true_;
- **privateTimer** [Boolean] defaults to _false_;

### Examples

```Javascript
//Creates a 30 seconds private timer without sounds and no description
Timer.createTimer(30, "", false, false, true);

//Creates a 10 seconds timer with the description 'Hurry Up!'
//Note: Plays sounds and isn't private
Timer.createTimer(10, "Hurry Up!");

//Create a private stopwatch with description 'Too long?'
Timer.createStopwatch("Too long?", true);
```

[1]: http://joaomeneses.pt/timerVTT/1.png
[2]: http://joaomeneses.pt/timerVTT/2.png
[3]: http://joaomeneses.pt/timerVTT/3.png
[4]: http://joaomeneses.pt/timerVTT/4.png
