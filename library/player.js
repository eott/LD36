Player = function(app) {
    this.app = app
    this.currentSprite = 'player_idle'
    this.health = 100
    this.maxHealth = 100
    this.hasArtifact = false
    this.nhd = {} // Next-hit-delay
}

Player.prototype.preload = function() {
    this.app.game.load.spritesheet('player_idle', 'assets/images/player/idle_spritesheet.png', 55, 114)
    this.app.game.load.spritesheet('player_running', 'assets/images/player/running_spritesheet.png', 86, 119)
    this.app.game.load.spritesheet('player_falling', 'assets/images/player/falling_spritesheet.png', 69, 118)
}

Player.prototype.create = function() {
    // Find start position by game object
    this.start = this.app.map.findObjectsByType('player_start', this.app.map.tilemap, 'Objects')
    this.start = this.start.pop()

    this.sprite = this.app.game.add.sprite(this.start.x, this.start.y, 'player_idle')

    this.app.game.physics.arcade.enable(this.sprite)

    this.sprite.body.gravity.y = 1500
    this.sprite.body.collideWorldBounds = true

    this.sprite.anchor.setTo(0.5, 0.5)

    var range = this.range(30)
    this.sprite.animations.add('player_idle', range, 30, true)
    this.sprite.animations.add('player_running', range, 30, true)
    this.sprite.animations.add('player_falling', range, 30, true)
    this.sprite.animations.play('player_idle')

    this.app.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER)
}

Player.prototype.update = function() {
    // Always check against walls so we don't fall through them when the game is stopped
    this.app.game.physics.arcade.collide(this.sprite, this.app.map.wallsLayer)

    // Check if the app is stopped before checking colliders and doing movement
    if (this.app.isStopped) {
        return;
    }

    // Check other collisions
    this.app.game.physics.arcade.collide(this.sprite, this.app.map.trapsGroup, this.trapContact, null, this)
    this.app.game.physics.arcade.overlap(this.sprite, this.app.map.endMarker, this.winLevel, null, this)
    this.app.game.physics.arcade.overlap(this.sprite, this.app.map.batteryGroup, this.battery, null, this)

    if (!this.hasArtifact) {
        this.app.game.physics.arcade.overlap(this.sprite, this.app.map.artifact, this.pickup, null, this)
    }

    // We have to check again since one of the collide callbacks might have triggered an app-stop
    if (this.app.isStopped) {
        return;
    }

    this.sprite.body.velocity.x = 0

    if (
        this.app.cursors.left.isDown
        || this.app.cursors.a.isDown
    ) {
        this.sprite.body.velocity.x = -325
        this.sprite.scale.x = -1
    } else if (
        this.app.cursors.right.isDown
        || this.app.cursors.d.isDown
    ) {
        this.sprite.body.velocity.x = 325
        this.sprite.scale.x = 1
    }

    if (
        this.sprite.body.onFloor()
        || this.sprite.body.touching.down
    ) {
        this.isFalling = false

        if (
            !this.isFalling
            && this.app.cursors.space.isDown
        ) {
            this.isFalling = true
            this.sprite.body.velocity.y = -800
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
        this.sprite.body.setSize(45, 113, 5, 0)
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
        this.hasArtifact
        && (
            this.app.cursors.q.isDown
            || this.app.cursors.v.isDown
        )
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
        this.app.sfx.playAudio('hit')
    }
}

Player.prototype.winLevel = function(player, marker) {
    this.sprite.animations.stop()
    this.app.win()
}

Player.prototype.loseLevel = function(player, marker) {
    this.sprite.animations.stop()
    this.app.loss()
}

Player.prototype.pickup = function(player, marker) {
    this.hasArtifact = true
    marker.visible = false
    this.app.stop()
    this.freeze()
    this.app.gfx.showMenuSlide('pickup')
}

Player.prototype.battery = function(player, marker) {
    if (!marker.hasBeenUsed) {
        this.health = Math.min(this.health + 30, this.maxHealth)
        this.app.sfx.playAudio('battery')
        marker.visible = false
        marker.hasBeenUsed = true
    }
}

Player.prototype.reset = function() {
    this.sprite.body.x = this.start.x
    this.sprite.body.y = this.start.y
    this.sprite.body.velocity.x = 0
    this.sprite.body.velocity.y = 0
    this.health = this.maxHealth

    this.hasArtifact = false
    this.app.map.artifact.visible = true

    this.freezeSafe = null
}

Player.prototype.freeze = function() {
    this.freezeSafe = [
        this.sprite.body.velocity.x,
        this.sprite.body.velocity.y,
        this.sprite.body.gravity.y
    ]

    this.sprite.body.velocity.x = 0
    this.sprite.body.velocity.y = 0
    this.sprite.body.gravity.y = 0
    this.sprite.animations.stop()
}

Player.prototype.unfreeze = function() {
    if (this.freezeSafe) {
        this.sprite.body.velocity.x = this.freezeSafe[0]
        this.sprite.body.velocity.y = this.freezeSafe[1]
        this.sprite.body.gravity.y = this.freezeSafe[2]
    }

    this.sprite.animations.play(this.currentSprite)
}