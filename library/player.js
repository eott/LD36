Player = function(app) {
    this.app = app
}

Player.prototype.preload = function() {
    this.app.game.load.spritesheet('player', 'assets/images/player/idle_spritesheet.png', 55, 114)
}

Player.prototype.create = function() {
    this.sprite = this.app.game.add.sprite(0, 0, 'player')

    this.app.game.physics.arcade.enable(this.sprite)

    this.sprite.body.gravity.y = 600
    this.sprite.body.collideWorldBounds = true

    var range = []
    for (var i = 0; i < 30; i++) {
        range.push(i)
    }

    this.sprite.animations.add('idle', range, 30, true)

    // Find start position by game object
    var start = this.app.map.findObjectsByType('player_start', this.app.map.tilemap, 'Objects');
    start = start.pop();
    this.sprite.body.x = start.X
    this.sprite.body.y = start.Y

    this.sprite.anchor.setTo(0.5, 0.5);

    this.app.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER)
}

Player.prototype.update = function() {
    this.app.game.physics.arcade.collide(this.sprite, this.app.map.wallsLayer);

    this.sprite.body.velocity.x = 0

    if (
        this.app.cursors.left.isDown
        || this.app.cursors.a.isDown
    ) {
        this.sprite.body.velocity.x = -150
        this.sprite.scale.x = -1
    } else if (
        this.app.cursors.right.isDown
        || this.app.cursors.d.isDown
    ) {
        this.sprite.body.velocity.x = 150
        this.sprite.scale.x = 1
    } else {
        this.sprite.animations.play('idle')
    }

    if (
        this.app.cursors.space.isDown
        && this.sprite.body.onFloor()
    ) {
        this.sprite.body.velocity.y = -350
    }
}