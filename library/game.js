App = function (width, height, elementName) {
    this.game = new Phaser.Game(width, height, Phaser.AUTO, elementName, this)
    this.player = new Player(this)
    this.map = new Map(this)
}

App.prototype.preload = function() {
    console.log('Preload App')

    this.map.preload()
    this.player.preload()
}

App.prototype.create = function() {
    console.log('Create App')

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.cursors = this.game.input.keyboard.addKeys({
        'left': Phaser.Keyboard.LEFT,
        'right': Phaser.Keyboard.RIGHT,
        'a': Phaser.Keyboard.A,
        'd': Phaser.Keyboard.D,
        'space': Phaser.Keyboard.SPACEBAR
    })

    this.map.create()
    this.player.create()
}

App.prototype.update = function() {
    this.map.update()
    this.player.update()
}

var app = new App(800, 600, 'gameView')
console.log('Parsing complete')