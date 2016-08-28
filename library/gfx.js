GFX = function(app) {
    this.app = app
}

GFX.prototype.preload = function() {
    this.app.game.load.image('winScreen', 'assets/images/icons/win_screen.png')
    this.app.game.load.image('lossScreen', 'assets/images/icons/loss_screen.png')
    this.app.game.load.image('startScreen', 'assets/images/icons/start_screen.png')
    this.app.game.load.script('filter', 'library/desaturation_filter.js')
}

GFX.prototype.create = function() {
    this.graphics = this.app.game.add.graphics(50, 50)
    this.filter = this.app.game.add.filter('Desaturation', this.app.game.width, this.app.game.height)
    this.startScreen = this.app.game.add.image(this.app.game.camera.x + 100, this.app.game.camera.y + 100, 'startScreen')
}

GFX.prototype.update = function() {
    if (this.app.gameStatus == -1) {
        if (this.app.cursors.y.isDown) {
            this.startScreen.kill()
            this.app.startLevel()
        } else {
            return;
        }
    }

    this.graphics.clear()
    this.graphics.beginFill(0x6a6a6a)
    this.graphics.lineStyle(10, 0x6a6a6a, 1)

    this.graphics.drawRect(
        this.app.game.camera.x - 3,
        this.app.game.camera.y - 3,
        166,
        26
    )

    this.graphics.beginFill(0x0000ff)
    this.graphics.lineStyle(10, 0x0000ff, 1)
    this.graphics.drawRect(
        this.app.game.camera.x,
        this.app.game.camera.y,
        Math.max(160 * this.app.player.health / this.app.player.maxHealth, 0),
        20
    )

    this.filter.update()

    if (
        (
            this.app.gameStatus == 2
            || this.app.gameStatus == 1
        )
        && this.app.cursors.y.isDown
    ) {
        this.app.reset()
    }
}

GFX.prototype.showWinScreen = function() {
    this.endScreen = this.app.game.add.image(this.app.game.camera.x + 100, this.app.game.camera.y + 100, 'winScreen')
}

GFX.prototype.showLossScreen = function() {
    this.endScreen = this.app.game.add.image(this.app.game.camera.x + 100, this.app.game.camera.y + 100, 'lossScreen')
}

GFX.prototype.reset = function() {
    this.graphics.clear()
    this.endScreen.kill()
}

GFX.prototype.timeStopEffects = function(flag) {
    if (flag) {
        this.app.game.stage.filters = [this.filter]
    } else {
        this.app.game.stage.filters = null
    }
}