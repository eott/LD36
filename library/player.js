Player = function(app) {
    this.app = app
}

Player.prototype.preload = function() {
    this.app.game.load.spritesheet('player', 'assets/images/player/idle_spritesheet.png', 55, 107)
}

Player.prototype.create = function() {
    this.sprite = this.app.game.add.sprite(32, this.app.game.world.height - 500, 'player')

    this.app.game.physics.arcade.enable(this.sprite)

    this.sprite.body.gravity.y = 600
    this.sprite.body.collideWorldBounds = true

    this.sprite.animations.add('left', [0, 1, 2, 3], 60, true)
    this.sprite.animations.add('right', [5, 6, 7, 8], 60, true)
}

Player.prototype.update = function() {
    this.app.game.physics.arcade.collide(this.sprite, this.app.map.platforms)

    this.sprite.body.velocity.x = 0

    if (
        this.app.cursors.left.isDown
        || this.app.cursors.a.isDown
    ) {
        this.sprite.body.velocity.x = -150
        this.sprite.animations.play('left')
    } else if (
        this.app.cursors.right.isDown
        || this.app.cursors.d.isDown
    ) {
        this.sprite.body.velocity.x = 150
        this.sprite.animations.play('right')
    } else {
        this.sprite.animations.stop()
        this.sprite.frame = 4
    }

    if (this.app.cursors.space.isDown && this.sprite.body.touching.down) {
        this.sprite.body.velocity.y = -350
    }
}