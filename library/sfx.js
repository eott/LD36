SFX = function(app) {
    this.app = app
    this.muted = false
}

SFX.prototype.preload = function() {
    this.app.game.load.audio('music', 'assets/audio/music/alien_ruins.ogg')
    this.app.game.load.audio('hit', 'assets/audio/effects/hit.wav')
    this.app.game.load.audio('timeResume', 'assets/audio/effects/time_resume.wav')
    this.app.game.load.audio('timeStop', 'assets/audio/effects/time_stop.wav')
}

SFX.prototype.create = function() {
    this.audioClips = {
        'hit': this.app.game.add.audio('hit', 0.5),
        'timeResume': this.app.game.add.audio('timeResume', 0.5),
        'timeStop': this.app.game.add.audio('timeStop', 0.5),
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
        this.pauseAudio('music')
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