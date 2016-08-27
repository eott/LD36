GFX = function(app) {
    this.app = app
}

GFX.prototype.preload = function() {

}

GFX.prototype.create = function() {
    this.graphics = this.app.game.add.graphics(50, 50)
}

GFX.prototype.update = function() {
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
}