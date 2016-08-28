App = function (width, height, elementName) {
    this.game = new Phaser.Game(width, height, Phaser.AUTO, elementName, this)
    this.player = new Player(this)
    this.map = new Map(this)
    this.gfx = new GFX(this)
    this.isStopped = false
    this.isTimeStopped = false
    this.fc = 0
    this.timeStopFc = 0
    this.gameStatus = 0 // 0 is normal, 1 is loss, 2 is win
}

App.prototype.preload = function() {
    console.log('Preload App')

    this.map.preload()
    this.player.preload()
    this.gfx.preload()
}

App.prototype.create = function() {
    console.log('Create App')

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.cursors = this.game.input.keyboard.addKeys({
        'left': Phaser.Keyboard.LEFT,
        'right': Phaser.Keyboard.RIGHT,
        'a': Phaser.Keyboard.A,
        'd': Phaser.Keyboard.D,
        'space': Phaser.Keyboard.SPACEBAR,
        'q': Phaser.Keyboard.Q,
        'v': Phaser.Keyboard.V,
        'y': Phaser.Keyboard.Y,
        'n': Phaser.Keyboard.N
    })

    this.map.create()
    this.player.create()
    this.gfx.create()
}

App.prototype.update = function() {
    this.map.update()
    this.player.update()
    this.gfx.update()

    this.timeStopFc = Math.max(this.timeStopFc - 1, 0)
    if (this.timeStopFc == 0) {
        this.isTimeStopped = false;
    }

    if (!this.isTimeStopped) {
        this.fc++
    }
}

App.prototype.timeStop = function() {
    if (this.timeStopFc == 0) {
        this.isTimeStopped = true;
        this.timeStopFc = 90
    }
}

App.prototype.stop = function() {
    this.isStopped = true
    this.isTimeStopped = true
}

App.prototype.win = function() {
    this.stop()
    this.gfx.showWinScreen()
    this.gameStatus = 2
}

App.prototype.loss = function() {
    this.stop()
    this.gfx.showLossScreen()
    this.gameStatus = 1
}

App.prototype.reset = function() {
    this.player.reset()
    this.map.reset()
    this.gfx.reset()

    this.isStopped = false
    this.isTimeStopped = false
    this.gameStatus = 0
}

var app = new App(800, 600, 'gameView')
console.log('Parsing complete')