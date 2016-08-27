Player = function(app) {
    this.app = app
    this.currentSprite = 'player_idle'
    this.health = 100
    this.maxHealth = 100
    this.nhd = {} // Next-hit-delay
}

Player.prototype.preload = function() {
    this.app.game.load.spritesheet('player_idle', 'assets/images/player/idle_spritesheet.png', 55, 114)
    this.app.game.load.spritesheet('player_running', 'assets/images/player/running_spritesheet.png', 86, 119)
    this.app.game.load.spritesheet('player_falling', 'assets/images/player/falling_spritesheet.png', 69, 118)
}

Player.prototype.create = function() {
    this.sprite = this.app.game.add.sprite(0, 0, 'player_idle')

    this.app.game.physics.arcade.enable(this.sprite)

    this.sprite.body.gravity.y = 900
    this.sprite.body.collideWorldBounds = true

    var range = this.range(30)
    this.sprite.animations.add('player_idle', range, 30, true)
    this.sprite.animations.add('player_running', range, 30, true)
    this.sprite.animations.add('player_falling', range, 30, true)
    this.sprite.animations.play('player_idle')

    // Find start position by game object
    var start = this.app.map.findObjectsByType('player_start', this.app.map.tilemap, 'Objects')
    start = start.pop()
    this.sprite.body.x = start.X
    this.sprite.body.y = start.Y

    this.sprite.anchor.setTo(0.5, 0.5)

    this.app.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER)
}

Player.prototype.update = function() {
    this.app.game.physics.arcade.collide(this.sprite, this.app.map.wallsLayer)
    this.app.game.physics.arcade.collide(this.sprite, this.app.map.trapsGroup, this.trapContact, null, this)
    this.app.game.physics.arcade.collide(this.sprite, this.app.map.endMarker, this.winLevel, null, this)

    if (this.app.isStopped) {
        return;
    }

    this.sprite.body.velocity.x = 0

    if (
        this.app.cursors.left.isDown
        || this.app.cursors.a.isDown
    ) {
        this.sprite.body.velocity.x = -250
        this.sprite.scale.x = -1
    } else if (
        this.app.cursors.right.isDown
        || this.app.cursors.d.isDown
    ) {
        this.sprite.body.velocity.x = 250
        this.sprite.scale.x = 1
    }

    if (this.sprite.body.onFloor()) {
        this.isFalling = false
        this.sprite.body.velocity.y = 0

        if (
            !this.isFalling
            && this.app.cursors.space.isDown
        ) {
            this.isFalling = true
            this.sprite.body.velocity.y = -500
        }
    }

    // There is some unexplained jitter for the y velocity, so we check
    // against "approximately zero"
    // TODO: Check if difference is caused by sprite height changes
    // We also track the direction so we know if the y velocity is zero
    // midair or on the ground
    if (
        this.sprite.body.velocity.y > 51
        || this.sprite.body.velocity.y < -51
    ) {
        var shouldBe = 'player_falling'
    } else if (
        this.sprite.body.velocity.x != 0
        && !this.isFalling
    ) {
        var shouldBe = 'player_running'
    } else if (!this.isFalling) {
        var shouldBe = 'player_idle'
    } else {
        var shouldBe = this.currentSprite
    }

    if (this.currentSprite != shouldBe) {
        this.currentSprite = shouldBe
        this.sprite.loadTexture(shouldBe, 0)
        this.sprite.animations.play(shouldBe)
    }

    // Advance NHDs
    for (idx in this.nhd) {
        this.nhd[idx] = Math.max(this.nhd[idx]-1, 0)
    }

    // Check loss condition
    if (this.health <= 0) {
        this.loseLevel()
    }

    // Check timestop
    if (
        this.app.cursors.q.isDown
        || this.app.cursors.v.isDown
    ) {
        this.app.timeStop()
    }
}

Player.prototype.range = function(nr) {
    var range = []
    for (var i = 0; i < nr; i++) {
        range.push(i)
    }
    return range
}

Player.prototype.trapContact = function(player, trap) {
    if (this.nhd[trap.name] == undefined || this.nhd[trap.name] == 0) {
        this.health -= trap.damage
        this.nhd[trap.name] = trap.nhd
    }
}

Player.prototype.winLevel = function(player, marker) {
    this.sprite.animations.stop()
    this.app.gfx.showWinScreen()
    this.app.stop()
}

Player.prototype.loseLevel = function(player, marker) {
    this.sprite.animations.stop()
    this.app.gfx.showLossScreen()
    this.app.stop()
}