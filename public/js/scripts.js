function playAudio(id) {
    var audio = new Audio('fx/' + id + '.mp3');
    audio.play();
}

function getTimerString(seconds) {
    var m = Math.floor(seconds / 60),
        s = seconds % 60,
        body = $('body');
    if (s < 10) {
        s = '0' + s;
    }
    return m + ':' + s;
}

function toggleBackground() {
    var body = $('body');
    if(body.hasClass('red')) {
        body.attr('class', 'orange');
    } else {
        body.attr('class', 'red');
    }
}

function Countdown(options) {
    var self = this;
    self.seconds = options.seconds || 90;

    self.counterStart = options.onCounterStart || function () {
        };
    self.updateStatus = options.onUpdateStatus || function () {
        };
    self.counterEnd = options.onCounterEnd || function () {
        };
    self.pauseToggle = options.onPauseToggle || function () {
        };
    self.timer = 0;
    self.currentSeconds = 0;
    self.isPaused = false;

    function decrementCounter() {
        self.currentSeconds--;
        self.updateStatus(self.currentSeconds);
        if (self.currentSeconds <= 0) {
            self.counterEnd();
            self.stop();
        }
    }

    self.start = function () {
        self.counterStart();
        self.isPaused = false;
        self.currentSeconds = self.seconds;
        self.run();
    };

    self.run = function () {
        clearInterval(self.timer);
        self.timer = setInterval(decrementCounter, 1000);
    };

    self.stop = function () {
        clearInterval(self.timer);
    };

    self.pause = function () {
        if(self.currentSeconds <= 0){
            return;
        }
        self.pauseToggle(self.isPaused);
        if (self.isPaused) {
            self.run();
        } else {
            self.stop();
        }
        self.isPaused = !self.isPaused;
    }
}

(function () {
    var seconds = 90,
        tickTimer = 0,
        countdown = new Countdown({
            seconds: seconds,
            onUpdateStatus: function (seconds) {
                var body = $('body');
                if (seconds < 10 && !body.hasClass('orange')) {
                    body.attr('class', 'orange');
                    playAudio('siren');
                }

                $('#content').text(getTimerString(seconds));
            },
            onPauseToggle: function (wasPaused) {
                var body = $('body');
                if (wasPaused) {
                    body.attr('class', 'green');
                } else {
                    body.attr('class', 'yellow');
                }
            },
            onCounterStart: function () {
                var body = $('body');
                body.attr('class', 'green');
                $('#content').text(getTimerString(seconds));
            },
            onCounterEnd: function () {
                $('body').attr('class', 'red');
                playAudio('ticking');
                tickTimer = setInterval(function(){
                    playAudio('ticking');
                    toggleBackground();
                }, 2000);
            }
        });

    $('body').keypress(function (event) {
        playAudio('beep');
        clearInterval(tickTimer);
        switch (event.which) {
            case 32: //space
                countdown.pause();
                break;
            case 13: //enter
                countdown.start();
                break;
            default:
                break;
        }
    });

    $('#content').text(getTimerString(seconds));
})();

