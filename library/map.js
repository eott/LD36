Map = function(app) {
    this.app = app
}

Map.prototype.preload = function() {
    this.app.game.load.image('sky', 'assets/images/background/sky.png')
    this.app.game.load.image('ground', 'assets/images/background/ground.png')
}

Map.prototype.create = function() {
    this.app.game.add.sprite(0, 0, 'sky')

    this.platforms = this.app.game.add.group()
    this.platforms.enableBody = true

    var ground = this.platforms.create(0, this.app.game.world.height - 64, 'ground')
    ground.scale.setTo(20, 2)
    ground.body.immovable = true

    var ledge = this.platforms.create(400, 400, 'ground')
    ledge.body.immovable = true

    ledge = this.platforms.create(-150, 250, 'ground')
    ledge.body.immovable = true
}

Map.prototype.update = function() {
    
}