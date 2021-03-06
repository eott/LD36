SFX = function(app) {
    this.app = app
    this.muted = false
}

SFX.prototype.preload = function() {
    this.app.game.load.audio('music', 'assets/audio/music/forgotten_tombs.ogg')
    this.app.game.load.audio('hit', 'assets/audio/effects/hit.wav')
    this.app.game.load.audio('beep', 'assets/audio/effects/beep.wav')
    this.app.game.load.audio('battery', 'assets/audio/effects/battery.wav')
    this.app.game.load.audio('timeResume', 'assets/audio/effects/time_resume.wav')
    this.app.game.load.audio('timeStop', 'assets/audio/effects/time_stop.wav')
}

SFX.prototype.create = function() {
    this.audioClips = {
        'hit': this.app.game.add.audio('hit', 0.4),
        'beep': this.app.game.add.audio('beep', 0.1, true),
        'battery': this.app.game.add.audio('battery', 0.4),
        'timeResume': this.app.game.add.audio('timeResume', 0.4),
        'timeStop': this.app.game.add.audio('timeStop', 0.4),
        'music': this.app.game.add.audio('music', 0.5, true),
    }

    this.playAudio('music')
}

SFX.prototype.update = function() {

}

SFX.prototype.muteSound = function() {
    this.muted = !this.muted
    
    if (!this.muted) {
        document.getElementById("mute").style.display = "inline-block"
        document.getElementById("unmute").style.display = "none"
        this.playAudio('music')
    } else {
        document.getElementById("mute").style.display = "none"
        document.getElementById("unmute").style.display = "inline-block"

        for (idx in this.audioClips) {
            this.pauseAudio(idx)
        }
    }
}

SFX.prototype.playAudio = function(name) {
    if (this.muted) {
        return;
    }

    if (this.audioClips[name] && !this.audioClips[name].isPlaying) {
        this.audioClips[name].play();
    }
}

SFX.prototype.pauseAudio = function(name) {
    this.audioClips[name].pause();
}